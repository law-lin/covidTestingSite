module.exports = function (req, res, next) {
  const { email, name, password } = req.body;

  function validEmail(userEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

  if (req.path === '/employees') {
    console.log(!email.length);
    if (![email, name, password].every(Boolean)) {
      return res.json('Missing credentials');
    } else if (!validEmail(email)) {
      return res.json('Invalid email');
    }
  } else if (req.path === '/employee') {
    if (![email, password].every(Boolean)) {
      return res.json('Missing credentials');
    } else if (!validEmail(email)) {
      return res.json('Invalid email');
    }
  }
  next();
};
