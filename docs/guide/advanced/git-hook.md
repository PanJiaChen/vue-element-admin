# Git Hooks

Programmers with engineering literacy will pay attention to coding standards, and Code Linting (Lint) is an important means to ensure code specification and consistency.

What are the benefits of using `Lint`? In my opinion, it has at least the following three points:

- Fewer bugs
- With higher development efficiency, Lint can easily find low-level, obvious errors.
- Higher code readability

Many times our `lint` check is placed in the continuous integration phase, the approximate process is as follows:

> Code Submission --> Run CI Found Problem (Remote) --> Local Fix Issue --> Resubmit --> Pass Check (Remote)

But there is a problem with this. Our `CI` (continuous integration) often doesn't just do `Lint` work, it also has many other tasks (such as packaging files, static resources uploaded to CDN, etc.), which leads to It's a special waste of time, it may take a few minutes for you to find the problem, or sometimes you don't find your `CI` is failed.

Common process: write the code locally, submit, start running lint, find that it does not pass, modify the code locally, submit it, wait for the result of CI, and repeat the previous operation if there are any problems.

## husky

The most effective solution is to put the `Lint` checksum locally. The common practice is to use [husky](https://github.com/typicode/husky) or [pre-commit](https://github.com/observing/pre-commit) Do a `Lint` check before committing locally.

> Of course, if you use `vue-cli@3` when creating your project, you can also use its built-in [yorkie](https://github.com/yyx990803/yorkie), which is based on `husky`, but Changed the interface. But here we still use `husky` as an example.

```bash
# Note: Our examples are all 1.3.1+ versions!
npm install husky -D -S
```

Then modify `package.json` to add the configuration:

```json
"husky": {
    "hooks": {
      "pre-commit": "eslint --ext .js,.vue src"
    }
  }
```

Finally try the `Git` submission and you will receive feedback soon:

```
git commit -m "Keep calm and commit"
```

But there is a problem. In my this git submission, I may have only modified one file. For example, I modified the content of `foo.js`, but it will still check all the '.js' files in `src`. It is very unfriendly. Every time I submit the code I wrote, I have to solve the other person's code lint problem first, then I can submit the code smoothly, and when the project is big, the inspection speed will become more and more slow.

## lint-staged

To solve the pain points above, you need to use [lint-staged](https://github.com/okonet/lint-staged). It will only check to check what you submitted or what you modified.

```bash
npm install lint-staged -D -S
```

Then, modify the package.json configuration:

```json
"husky": {
  "hooks": {
    "pre-commit": "lint-staged"
  }
},
"lint-staged": {
    "src/**/*.{js,vue}": [
      "eslint --fix",
      "git add"
    ]
  }
```

As configured above, each time it will only check your local configuration for the `eslint` rule (this see the document [ESLint](eslint.md)) before your local `commit`, if it meets the rules, it will be submitted successfully. If it does not match, it will automatically execute `eslint --fix` to try to help you fix it automatically. If the repair is successful, it will help you to submit the repaired code. If it fails, you will be prompted with an error, and you will be allowed to submit the code only after you fix it.

## To sum up

The best `lint` specification process is to recommend team members to configure `eslint` in their own editor, and turn on the `eslint-loader` error in webpack, so the editor can help you automatically fixed some simple errors when you write. At the same time, it can obviously remind you of the code that does not meet the `lint` specification. See [ESLint](eslint.md) for details on this.

But this is not mandatory. Some team members or newly arrived interns have not configured the lint rule in the editor or ignored the error in the command line. In this case, you need to configure the mandatory pre-commit. Check that everything submitted to the remote repository is in compliance with the team's specifications.
