import { Request, Response, NextFunction } from 'express';
import * as passport from 'passport';
import { Strategy, ExtractJwt, StrategyOptions, VerifiedCallback } from 'passport-jwt';

export function initTokenAuth() {
    const params: StrategyOptions =  {
        secretOrKey: process.env.TOKEN_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        passReqToCallback: true
    };

    passport.use('jwt', new Strategy(params, async (_req: Request, payload: any, done: VerifiedCallback) => {
        if (payload && payload.id) {
            done(null, { id: payload.id });
        } else {
            done(null, false, { error: { message: 'User not found' } });
        }
    }));

    return passport.initialize();
}

export const authRoute = passport.authenticate('jwt', { session: false });
export const optionalAuthRoute = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (_err, user, _info) => {
        req.user = user || null;
        next();
    })(req, res, next);
};
