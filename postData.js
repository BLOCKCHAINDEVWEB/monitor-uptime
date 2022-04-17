export const postData = 
  {
    stat: "ok",
    pagination: {
      offset: 0,
      limit: 50,
      total: 1
    },
    monitors: [
      {
        id: 791335018,
        friendly_name: "Providers RPC",
        url: "http://localhost:3000",
        type: 1,
        sub_type: "",
        keyword_type: null,
        keyword_case_type: null,
        keyword_value: "",
        http_username: "",
        http_password: "",
        port: "",
        interval: 300,
        timeout: 30,
        status: 2,
        create_datetime: 1649307640,
        logs: [
          {
              id: 2587705605,
              type: 2,
              datetime: 1649780605,
              duration: 133992,
              reason: {
                  code: "200",
                  detail: "OK"
              }
          },
          {
              id: 2587664220,
              type: 1,
              datetime: 1649777006,
              duration: 3599,
              reason: {
                  code: "503",
                  detail: "Service Unavailable"
              }
          },
          {
              id: 2582598546,
              type: 2,
              datetime: 1649307677,
              duration: 469329,
              reason: {
                  code: "200",
                  detail: "OK"
              }
          }
        ],
        custom_uptime_ranges: "100.000-95.834-100.000-100.000-100.000-100.000-100.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-0.000-99.379",
        lastLogTypeBeforeStartDate: {}
      }
    ]
  }
