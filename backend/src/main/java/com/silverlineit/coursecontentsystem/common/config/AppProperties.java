package com.silverlineit.coursecontentsystem.common.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app")
@Getter
@Setter
public class AppProperties {

    private String frontendUrl;
    private Jwt jwt = new Jwt();
    private Storage storage = new Storage();
    private Upload upload = new Upload();
    private Mail mail = new Mail();

    @Getter
    @Setter
    public static class Jwt {
        private String secret;
        private long accessTokenExpiryMs;
        private long refreshTokenExpiryMs;
    }

    @Getter
    @Setter
    public static class Storage {
        private String provider;
        private Local local = new Local();
        private S3 s3 = new S3();

        @Getter
        @Setter
        public static class Local {
            private String uploadDir;
        }

        @Getter
        @Setter
        public static class S3 {
            private String bucket;
            private String region;
            private String accessKey;
            private String secretKey;
        }
    }

    @Getter
    @Setter
    public static class Upload {
        private long maxFileSizeBytes;
        private String allowedTypes;
    }

    @Getter
    @Setter
    public static class Mail {
        private String fromName;
        private String fromAddress;
    }
}