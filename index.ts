export const makeParallelCalls = (funcForParallel, range, extra = {}) => {
  const { year, month } = range;
  const start_date = new Date(year, month - 1, 1);
  const end_date = new Date(year, month, 0);
  const middle = new Date((start_date.getTime() + end_date.getTime()) / 2);
  const middleNextDay = new Date(middle.getDate() + 1);

  return Promise.all([
    funcForParallel({
      start_date,
      end_date: middle,
      ...extra,
    }),
    funcForParallel({
      start_date: middleNextDay,
      end_date,
      ...extra,
    }),
  ])
    .then((result) => {
      console.log(result, 'then 1');
      return [];
    })
    .then((result) => {
      console.log(result, 'then 2');
      return {};
    });
};

const api = (delay) => {
  console.log('reached api');
  return (args) =>
    new Promise((resolve) => {
      console.log('reached Promise', delay, args);
      setTimeout(resolve, delay, args);
    });
};

async function query() {
  return makeParallelCalls(api(100), {
    month: '10',
    year: 2022,
  });
}

async function mainFn() {
  console.log('reached');
  const result = await query();
  console.log(result, 'result');
}

mainFn();
