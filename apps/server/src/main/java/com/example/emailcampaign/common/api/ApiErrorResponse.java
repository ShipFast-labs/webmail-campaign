package com.example.emailcampaign.common.api;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiErrorResponse {
    private ErrorDetail error;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ErrorDetail {
        private String code;
        private String message;
        private String traceId;
    }

    public static ApiErrorResponse of(String code, String message, String traceId) {
        return new ApiErrorResponse(new ErrorDetail(code, message, traceId));
    }
}
