const data = [
  {
    name: '1',
    timeLine: 100,
    children: [
      {
        name: '1-1',
        timeLine: 20
      },
      {
        name: '1-2',
        timeLine: 60,
        children: [
          {
            name: '1-2-1',
            timeLine: 35
          },
          {
            name: '1-2-2',
            timeLine: 25
          }
        ]
      }
    ]
  },
  {
    name: '2',
    timeLine: 80,
    children: [
      {
        name: '2-1',
        timeLine: 30
      },
      {
        name: '2-2',
        timeLine: 50
      },
      {
        name: '2-3',
        timeLine: 60
      }
    ]
  },
  {
    name: '3',
    timeLine: 40
  }
]

export default data

