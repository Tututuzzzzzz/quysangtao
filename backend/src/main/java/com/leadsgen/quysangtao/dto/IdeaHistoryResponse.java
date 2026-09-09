package com.leadsgen.quysangtao.dto;

import com.leadsgen.quysangtao.entity.IdeaStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class IdeaHistoryResponse {
    private Long id;
    private Long ideaId;
    private IdeaStatus oldStatus;
    private IdeaStatus newStatus;
    private String note;
    private Long changedById;
    private String changedByName;
    private String changedByAvatar;
    private LocalDateTime createdAt;
}
