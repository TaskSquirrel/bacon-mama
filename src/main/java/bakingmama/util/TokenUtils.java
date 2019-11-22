package bakingmama.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

public class TokenUtils {
    private static Algorithm algorithm = Algorithm.HMAC256("cse 308 is so cool!!");

    public static JWTVerifier getVerifier() {
        return JWT.require(algorithm).build();
    }

    public static Algorithm getAlgorithm() {
        return algorithm;
    }

    public static DecodedJWT verifyToken(String token) throws JWTVerificationException {
        JWTVerifier verifier = JWT.require(algorithm)
                .build();

        return verifier.verify(token);
    }

    public static UserToken verifyAndDecode(String token) {
        DecodedJWT jwt = verifyToken(token);

        String userName = jwt.getClaim("username").asString();
        String userID = jwt.getClaim("userID").asString();

        return new UserToken(userName, userID);
    }

    @RequiredArgsConstructor
    @Getter
    public static class UserToken {
        private final String userName;
        private final String userID;
    }
}
