package bakingmama.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;

public class TokenUtils {
    private static Algorithm algorithm = Algorithm.HMAC256("cse 308 is so cool!!");

    public static JWTVerifier getVerifier() {
        return JWT.require(algorithm).build();
    }

    public static Algorithm getAlgorithm() {
        return algorithm;
    }

    public static String verifyToken(String token){
        try {
            JWTVerifier verifier = JWT.require(algorithm)
                    .build();
            verifier.verify(token);
            return "true";
        } catch (Exception e){
            String returnString = "Exception Thrown at Verify Token";
            return returnString;
        }
    }
}
