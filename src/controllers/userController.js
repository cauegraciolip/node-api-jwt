const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv/config");

module.exports = {
  async login(req, res) {
    const selectUser = await User.findOne({ where: { email: req.body.email } });

    if (!selectUser) return res.status(400).json("Email ou senha incorretos");

    const passwordUserMatch = bcrypt.compareSync(
      req.body.password,
      selectUser.password
    );

    if (!passwordUserMatch)
      return res.status(400).json("Email ou senha incorretos");

    const token = jwt.sign({ id: selectUser.id }, process.env.TOKEN_SECRET);

    res.header("auth-token", token);

    res.status(200).json("Logado como usuário comum");
  },

  async store(req, res) {
    const { name, email, admin, password } = req.body;
    const selectedEmail = await User.findOne({ where: { email: email } });

    if (selectedEmail) return res.json("Email já cadastrado");

    try {
      await User.create({
        name,
        email,
        admin,
        password: bcrypt.hashSync(password),
      });
      res.status(200).json("Cadastro efetuado com sucesso");
    } catch (err) {
      res.status(400).json(err);
    }
  },
};
