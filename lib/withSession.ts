import { ironOptions } from "@utils/ironSessionconfig";
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import {
    GetServerSidePropsContext,
    GetServerSidePropsResult,
    NextApiHandler,
} from "next";

export function withSessionRoute(handler: NextApiHandler) {
    return withIronSessionApiRoute(handler, ironOptions);
}

export function withSessionSsr<
    P extends { [key: string]: unknown } = { [key: string]: unknown },
>(
    handler: (
        context: GetServerSidePropsContext,
    ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
) {
    return withIronSessionSsr(handler, ironOptions);
}
