package com.platform.codingplatform.judge;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class JudgeService {

    private final String API_URL = "http://localhost:2358/submissions/?base64_encoded=false&wait=true";

    public String submitCode(String sourceCode, String languageId, String stdin) {
        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> payload = new HashMap<>();
        payload.put("source_code", sourceCode);
        payload.put("language_id", Integer.parseInt(languageId));
        payload.put("stdin", stdin);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(API_URL, entity, Map.class);

        return response.getBody().toString();
    }
}
