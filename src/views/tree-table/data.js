
const data = [
  {
    id: 0,
    event: 'Event-0',
    timeLine: 50
  },
  {
    id: 1,
    event: 'Event-1',
    timeLine: 100,
    children: [
      {
        id: 2,
        event: 'Event-2',
        timeLine: 10

      },
      {
        id: 3,
        event: 'Event-3',
        timeLine: 90,
        children: [
          {
            id: 4,
            event: 'Event-4',
            timeLine: 5

          },
          {
            id: 5,
            event: 'Event-5',
            timeLine: 10

          },
          {
            id: 6,
            event: 'Event-6',
            timeLine: 75,

            children: [
              {
                id: 7,
                event: 'Event-7',
                timeLine: 50,

                children: [
                  {
                    id: 71,
                    event: 'Event-7-1',
                    timeLine: 25

                  },
                  {
                    id: 72,
                    event: 'Event-7-2',
                    timeLine: 5

                  },
                  {
                    id: 73,
                    event: 'Event-7-3',
                    timeLine: 20
                  }
                ]
              },
              {
                id: 8,
                event: 'Event-8',
                timeLine: 25
              }
            ]
          }
        ]
      }
    ]
  }
]

export default data
