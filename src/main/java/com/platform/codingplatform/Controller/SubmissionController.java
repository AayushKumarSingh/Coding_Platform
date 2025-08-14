package com.platform.codingplatform.Controller;

import com.platform.codingplatform.model.TestCase;
import com.platform.codingplatform.repository.TestCaseRepository;
import com.platform.codingplatform.runner.PythonExecutor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/submit")
public class SubmissionController {

    @Autowired
    private PythonExecutor judgeService;

    @Autowired
    private TestCaseRepository testCaseRepository;

    @PostMapping
    public String submitCode(@RequestBody Map<String, String> body) {
        String code = body.get("code");
//        String langId = body.get("languageId");
        String input = body.get("input");

        return judgeService.runPythonCode(code, input);
    }

    @PostMapping("/{problemId}")
    public Map<String, Object> evaluateCode(@PathVariable Long problemId, @RequestBody Map<String, String> body){
        String code = body.get("code");

        List<TestCase> testCases = testCaseRepository.findByProblemId(problemId);
        List<Map<String, Object>> results = new ArrayList<>();

        for (TestCase testCase: testCases){
            String output = judgeService.runPythonCode(code, testCase.getInput()).trim();
            boolean passed = output.equals(testCase.getExpectedOutput().trim());

            Map<String, Object> result = new HashMap<>();
            result.put("input", testCase.getInput());
            result.put("expected", testCase.getExpectedOutput());
            result.put("actual", output);
            result.put("passed", passed);
            results.add(result);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("results", results);
        response.put("total", testCases.size());
        response.put("passed", results.stream().filter(r -> (boolean) r.get("passed")).count());

        return response;
    }
}
