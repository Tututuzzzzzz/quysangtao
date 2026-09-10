package com.leadsgen.quysangtao.controller;

import com.leadsgen.quysangtao.service.S3StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class FileUploadController {

    private final S3StorageService s3StorageService;

    @PostMapping
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "File upload không được để trống!");
            return ResponseEntity.badRequest().body(error);
        }

        try {
            String fileUrl = s3StorageService.uploadFile(file);
            String originalFilename = file.getOriginalFilename();

            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            response.put("name", originalFilename != null ? originalFilename : "file");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Không thể lưu file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
