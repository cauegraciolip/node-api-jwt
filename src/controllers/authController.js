const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv/config");

module.exports = {
  async adminLogin(req, res) {
    const { email } = req.body;
    const userFind = await User.findOne({
      attribute: ["email", "password"],
      where: { email: email },
    });

    if (!userFind) return res.json("Usuário ou senha inválido");

    if (!userFind.admin)
      return res.json({
        message: "Acesso negado",
        alert: "Você não tem permissão para acessar essa rota",
        tip: "Acesse sua conta em localhost:3333/login",
      });

    const passwordUserAdmin = bcrypt.compareSync(
      req.body.password,
      userFind.password
    );

    if (!passwordUserAdmin)
      return res.status(400).json("Usuário e/ou senha incorretos");

    const tokenAdmin = jwt.sign({ id: userFind.id }, process.env.TOKEN_SECRET);

    res.header("auth-token", tokenAdmin);
    res
      .status(200)
      .json({ message: "Você está vendo essa mensagem como administrador" });
  },
};
