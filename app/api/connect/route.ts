import { withSessionRoute } from "@lib/withSession";

export default withSessionRoute(async function loginRoute(req, res) {
  // Perform SIWE, Passkeys, or other logic here
  // For demonstration, we'll set user directly
  req.session.user = {
    walletAddress: "0xdeadbeef",
    admin: false,
  };
  await req.session.save();
  console.log("from route", { user: req.session.user });
  res.send({ ok: true });
  console.log("sent response", { ok: true })
});

