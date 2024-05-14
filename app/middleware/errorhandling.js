/**
 * Middleware function to handle errors.
 *
 * @param {Error} err - The error object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void} - Sends a 500 status code with an error message.
 */
module.exports = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
   };