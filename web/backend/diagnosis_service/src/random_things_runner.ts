import { db } from './db_repo';

db.vote(5, 1, true)
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {});
