module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
        "prettier/prettier",
    ],
    "overrides": [
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "@typescript-eslint",
        "react-hooks"
    ],
    "rules": {
        "react/jsx-filename-extension":["warn",{"extensions":[".tsx"]} ],
        "@typescript-eslint/explicit-function-return-type":[
            "warn",
            {
              "allowExpressions":true
            }
            ],
            "react-hooks/rules-of-hooks":"error",
            "react-hooks/exhaustive-deps":"warn",
            "import/extensions": [
                'off',
              ],    
            "react/display-name":"off",
            "no-var":"warn"


    },
    "settings":{
        "import/resolver":{
          "typescript":{}
        }
      }
}