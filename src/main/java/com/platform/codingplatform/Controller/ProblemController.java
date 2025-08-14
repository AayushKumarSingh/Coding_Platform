package com.platform.codingplatform.Controller;

import com.platform.codingplatform.model.Problem;
import com.platform.codingplatform.Service.ProblemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
public class ProblemController {

    @Autowired
    private ProblemService problemService;

    @PostMapping("/add")
    public Problem addProblem(@RequestBody Problem problem) {
        System.out.println("Problem received: " + problem);
        return problemService.addProblem(problem);
    }

    @GetMapping("/all")
    public List<Problem> getAllProblems() {
        return problemService.getAllProblems();
    }

    @GetMapping("/{id}")
    public Problem getProblem(@PathVariable Long id) {
        return problemService.getProblemById(id);
    }
}
