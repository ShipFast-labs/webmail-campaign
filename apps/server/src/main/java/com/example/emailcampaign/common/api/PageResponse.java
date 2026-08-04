package com.example.emailcampaign.common.api;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageResponse {
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;

    public static PageResponse from(Page<?> page) {
        return new PageResponse(
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages()
        );
    }
}
