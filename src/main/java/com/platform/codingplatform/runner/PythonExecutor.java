package com.platform.codingplatform.runner;
import org.springframework.stereotype.Service;
import java.io.*;
import java.util.concurrent.TimeUnit;

@Service
public class PythonExecutor {
    public String runPythonCode(String code, String input) {
        try {
            File scriptfile = File.createTempFile("user_code", ".py");
            FileWriter writer = new FileWriter(scriptfile);
            writer.write(code);
            writer.close();

            ProcessBuilder builder = new ProcessBuilder("python", scriptfile.getAbsolutePath());
            Process process = builder.start();

            if (input != null && !input.isEmpty()) {
                BufferedWriter stdin = new BufferedWriter(new OutputStreamWriter(process.getOutputStream()));
                stdin.write(input);
                stdin.newLine();
                stdin.flush();
                stdin.close();
            }

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();


            boolean finished = process.waitFor(30, TimeUnit.SECONDS);

            if (!finished) {
                process.destroyForcibly();
                scriptfile.delete();
                return "Error: Execution time limit exceeded";
            }

            String line;

            while ((line = reader.readLine()) != null)
                output.append(line).append("\n");

            scriptfile.delete();
            return output.toString();

        } catch (Exception e) {
            return "Execution error : " + e.getMessage();
        }
    }
}
