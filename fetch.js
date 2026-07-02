fetch('https://influxe1.vercel.app/')
  .then(res => res.text())
  .then(console.log)
  .catch(console.error);
