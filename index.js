import dotenv from 'dotenv';
import express from 'express';
import { ethers } from 'ethers';
import { WebSocketProvider, FallbackProvider } from '@ethersproject/providers';


dotenv.config();

const app = express();
app.use(express.json());

const {
  XDAI_PROVIDER_URLS,
  SOKOL_PROVIDER_URLS,
  MUMBAI_PROVIDER_URLS,
  NETWORK_WHITELIST,
  EXPECTED_PONG_BACK,
  KEEP_ALIVE_CHECK_INTERVAL,
  PORT,
  SET_INTERVAL_TIMER_LISTENER_TIMEOUT_PAYMENT,
  SET_INTERVAL_TIMER_LISTENER_TIMEOUT_CLAIM
} = process.env


const network_name_whitelist = process.env.NETWORK_WHITELIST.replace(/\d+|:/g,'');

network_name_whitelist.split('|').map(async network => {
  if (eval(`${network.toUpperCase()}_PROVIDER_URLS`) === '') return;

  const wsUrlsArray = []
  let stallTimeout = 500;

  eval(`${network.toUpperCase()}_PROVIDER_URLS`).split(',').map(providerNameToWssUrl => {
    const [providerName, providerUrl] = providerNameToWssUrl.split('@'); // Use "@" because ":"is already used.

    stallTimeout = stallTimeout + 500
    wsUrlsArray.push(providerUrl)

    const keepAlive = ({
      network,
      provider,
      onDisconnect,
      EXPECTED_PONG_BACK,
      KEEP_ALIVE_CHECK_INTERVAL,
    }) => {

      let pingTimeout = null;
      let keepAliveInterval = null;
      const printLogs = false;

      provider.on('open', code => {
        keepAliveInterval = setInterval(() => {
          if (printLogs) console.log(`Checking if the connection is alive, sending a ping on ${network} with the ${providerName} provider`);

          console.log(`Server open with code: ${code}`);

          provider.ping();

          // Use `WebSocket#terminate()`, which immediately destroys the connection,
          // instead of `WebSocket#close()`, which waits for the close timer.
          // Delay should be equal to the interval at which your server
          // sends out pings plus a conservative assumption of the latency.
          pingTimeout = setTimeout(() => {
            provider.terminate();
          }, EXPECTED_PONG_BACK);
        }, KEEP_ALIVE_CHECK_INTERVAL);
      });

      provider.on('close', () => {
        console.error(`The websocket connection was closed on ${network} with the ${providerName} provider`);

        if (keepAliveInterval) clearInterval(keepAliveInterval);
        if (pingTimeout) clearTimeout(pingTimeout);

        onDisconnect(error);
      });

      provider.on('pong', () => {
        if (printLogs) console.log(`Received pong, so connection is alive, clearing the timeout on ${network} with the ${providerName} provider`);

        if (pingTimeout) clearInterval(pingTimeout);
      });

      provider.on('error', error => {
        console.error(`The websocket errored on ${network} with the ${providerName} provider`, error);

        if (keepAliveInterval) clearInterval(keepAliveInterval);
        if (pingTimeout) clearTimeout(pingTimeout);

        onDisconnect(error);
      });
    };

    const startConnection = async ({ network }) => {
      console.log(`The websocket is (re)starting on ${network} with the ${providerName} provider`);

      let providersArray = [];

      wsUrlsArray.map(async wsUrl => {

        const wsProvider = new WebSocketProvider(wsUrl);

        wsProvider.on('block', async (blockNumber) => {
          console.log(`New Block: ${blockNumber} on ${providerName}`);
          const { baseFeePerGas } = await wsProvider.getBlock(blockNumber)
          console.log('baseFeePerGas', baseFeePerGas.toString())
        });

        providersArray.push({ provider: wsProvider, stallTimeout })
      });

      const provider =  new FallbackProvider(providersArray, 1);

      const { providerConfigs: [{ provider: { connection: { url: wsUrl }={} }={} }={}]=[] } = provider;
      console.log({wsUrl})
      console.log(`The websocket is (re)starting on ${network} with the ${providerName} provider`);

      const feeDataProvider = await provider.getFeeData();
      const gasFeeProvider = typeof(feeDataProvider) === 'object' && ethers.utils.formatUnits(feeDataProvider.gasPrice, "gwei");

      if (parseFloat(gasFeeProvider) < 0) return console.error(`Error provider (gasFee=null) on ${network} with the ${providerName} provider.`);

      keepAlive({
        network,
        provider,
        onDisconnect: (error) => {
          startConnection({ network });
          console.error('The ws connection was closed', JSON.stringify(error, null, 2));
        },
        EXPECTED_PONG_BACK,
        KEEP_ALIVE_CHECK_INTERVAL,
      });

    };

    startConnection({ network });
  })

})

app.set('port', PORT || 5000);

app.get('/', (req, res) => {
  res.send('App is running...');
}).listen(app.get('port'), function() {
  console.log('App is running, server is listening on port ', app.get('port'));
});