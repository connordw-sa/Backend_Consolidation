import mongoose from 'mongoose';

export const errorHandler = (err, req, res, next) => {
  console.log('Error:', err);

  switch (true) {
    case err.status === 400:
    case err instanceof mongoose.Error.ValidationError:
      res.status(400).send({ message: 'Bad request' });
      break;
    case err.status === 401:
      res.status(401).send({ message: 'Unauthorized ' });
      break;
    case err.status === 403:
      res.status(403).send({ success: false, message: 'Forbidden' });
      break;
    case err.status === 404:
      res.status(404).send({ message: 'Not found' });
      break;
    default:
      res.status(500).send({ message: 'Server Error' });
  }
};
