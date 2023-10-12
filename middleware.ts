// middleware.ts
import { ironOptions } from "@utils/ironSessionconfig";
import { getIronSession } from "iron-session/edge";
import { NextRequest, NextResponse } from "next/server";

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();
  const session = await getIronSession(req, res, ironOptions);

  // do anything with session here:
  const { user } = session;

  // like mutate user:
  // user.something = someOtherThing;
  // or:
  // session.user = someoneElse;

  // uncomment next line to commit changes:
  // await session.save();
  // or maybe you want to destroy session:
  // await session.destroy();

  console.log("from middleware", { user });

  // demo:
  if (user?.admin !== true) {
    // unauthorized to see pages inside admin/
    return NextResponse.redirect(new URL('/unauthorized', req.url)) // redirect to /unauthorized page
  }

  return res;
};

export const config = {
  matcher: "/admin",
};