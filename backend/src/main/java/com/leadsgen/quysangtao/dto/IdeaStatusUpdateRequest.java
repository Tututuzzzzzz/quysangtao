package com.leadsgen.quysangtao.dto;

import com.leadsgen.quysangtao.entity.IdeaStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class IdeaStatusUpdateRequest {
    @NotNull
    private IdeaStatus newStatus;

    private String note;
}
