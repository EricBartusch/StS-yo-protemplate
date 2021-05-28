"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");

module.exports = class extends Generator {
  async prompting() {
    this.log(
      yosay(`Welcome to the ${chalk.red("sts-protemplate")} generator!`)
    );

    this.answers = await this.prompt([
      {
        type: "input",
        name: "modIdPascal",
        message: "Mod ID PascalCase:"
      },
      {
        type: "author",
        name: "author",
        message: "Who is making this?"
      },
      {
        type: "input",
        name: "steamPath",
        message:
          "Where is steam installed? If blank, will default to: C:\\Program Files (x86)\\Steam\\steamapps",
        default: "C:\\Program Files (x86)\\Steam\\steamapps"
      },
      {
        type: "confirm",
        name: "createCards",
        message: "Are you making new cards?"
      },
      {
        type: "confirm",
        name: "createRelics",
        message: "Relics?"
      },
      {
        type: "confirm",
        name: "createCardMods",
        message: "CardMods?"
      },
      {
        type: "confirm",
        name: "createPowers",
        message: "Powers?"
      },
      {
        type: "confirm",
        name: "createActions",
        message: "Actions?"
      },
      {
        type: "confirm",
        name: "createChar",
        message: "New Character?"
      }
    ]);

    this.answers.modIdPascal =
      this.answers.modIdPascal.charAt(0).toUpperCase() +
      this.answers.modIdPascal.slice(1);
    this.modIdCamel = toCamelCase(this.answers.modIdPascal);
  }

  writing() {
    // Entrypoint
    this.fs.copyTpl(
      this.templatePath(`src/main/java/theTodo/TodoMod.java`),
      this.destinationPath(
        `src/main/java/${this.modIdCamel}/${this.answers.modIdPascal}.java`
      ),
      {
        modIdPascal: this.answers.modIdPascal,
        modIdCamel: this.modIdCamel,
        modIdLower: this.answers.modIdPascal.toLowerCase(),
        createCards: this.answers.createCards,
        createRelics: this.answers.createRelics,
        createPowers: this.answers.createPowers,
        createChar: this.answers.createChar
      }
    );

    // Custom Character
    if (this.answers.createChar) {
      this.fs.copyTpl(
        this.templatePath(`src/main/java/theTodo/TheTodo.java`),
        this.destinationPath(`src/main/java/${this.modIdCamel}/TheTodo.java`),
        {
          modIdPascal: this.answers.modIdPascal,
          modIdCamel: this.modIdCamel,
          createCards: this.answers.createCards,
          createRelics: this.answers.createRelics
        }
      );
    }

    // Pom
    this.fs.copyTpl(
      this.templatePath("pom.xml"),
      this.destinationPath("pom.xml"),
      {
        modIdPascal: this.answers.modIdPascal,
        modIdCamel: this.modIdCamel,
        modIdLower: this.answers.modIdPascal.toLowerCase(),
        modIdSpaces: this.answers.modIdPascal
          .replace(/([A-Z])/g, " $1")
          .slice(1),
        steamPath: this.answers.steamPath
      }
    );

    // Actions
    if (this.answers.createActions) {
      this.fs.copyTpl(
        this.templatePath(`src/main/java/theTodo/actions/*`),
        this.destinationPath(`src/main/java/${this.modIdCamel}/actions/`),
        {
          modIdPascal: this.answers.modIdPascal,
          modIdCamel: this.modIdCamel
        },
        null,
        { globOptions: { dot: true } }
      );
    }

    // Cardmods
    if (this.answers.createCardMods) {
      this.fs.copyTpl(
        this.templatePath(`src/main/java/theTodo/cardmods/*`),
        this.destinationPath(`src/main/java/${this.modIdCamel}/cardmods/`),
        {
          modIdPascal: this.answers.modIdPascal,
          modIdCamel: this.modIdCamel
        },
        null,
        { globOptions: { dot: true } }
      );
    }

    // Cards
    if (this.answers.createCards) {
      this.fs.copyTpl(
        this.templatePath(`src/main/java/theTodo/cards/**/*`),
        this.destinationPath(`src/main/java/${this.modIdCamel}/cards/`),
        {
          modIdPascal: this.answers.modIdPascal,
          modIdCamel: this.modIdCamel
        },
        null,
        { globOptions: { dot: true } }
      );
    }

    // Powers
    if (this.answers.createPowers) {
      this.fs.copyTpl(
        this.templatePath(`src/main/java/theTodo/powers/*`),
        this.destinationPath(`src/main/java/${this.modIdCamel}/powers/`),
        {
          modIdPascal: this.answers.modIdPascal,
          modIdCamel: this.modIdCamel
        },
        null,
        { globOptions: { dot: true } }
      );
    }

    // Relics
    if (this.answers.createRelics) {
      this.fs.copyTpl(
        this.templatePath(`src/main/java/theTodo/relics/*`),
        this.destinationPath(`src/main/java/${this.modIdCamel}/relics/`),
        {
          modIdPascal: this.answers.modIdPascal,
          modIdCamel: this.modIdCamel
        },
        null,
        { globOptions: { dot: true } }
      );
    }

    // Util
    this.fs.copyTpl(
      this.templatePath(`src/main/java/theTodo/util/*`),
      this.destinationPath(`src/main/java/${this.modIdCamel}/util/`),
      {
        modIdPascal: this.answers.modIdPascal,
        modIdCamel: this.modIdCamel,
        createPowers: this.answers.createPowers,
        createActions: this.answers.createActions
      },
      null,
      { globOptions: { dot: true } }
    );

    // Resources
    this.fs.copyTpl(
      this.templatePath(`src/main/resources/todomodResources/**/*`),
      this.destinationPath(
        `src/main/resources/${this.answers.modIdPascal.toLowerCase()}Resources/`
      ),
      {
        modIdPascal: this.answers.modIdPascal,
        modIdCamel: this.modIdCamel
      },
      null,
      { globOptions: { dot: true } }
    );

    this.fs.copyTpl(
      this.templatePath(`src/main/resources/ModTheSpire.json`),
      this.destinationPath(`src/main/resources/ModTheSpire.json`),
      {
        modIdPascal: this.answers.modIdPascal,
        modIdCamel: this.modIdCamel,
        author: this.answers.author
      }
    );

    // Delete unused stuff
    if (!this.answers.createCards) {
      this.fs.delete(
        `src/main/java/${this.modIdCamel}/util/CardArtRoller.java`
      );
      this.fs.delete(
        `src/main/resources/${this.answers.modIdPascal.toLowerCase()}Resources/localization/eng/Cardstrings.json`
      );
    }

    if (!this.answers.createRelics) {
      this.fs.delete(
        `src/main/resources/${this.answers.modIdPascal.toLowerCase()}Resources/localization/eng/Relicstrings.json`
      );
    }

    if (!this.answers.createCardMods) {
      this.fs.delete(
        `src/main/java/${this.modIdCamel}/cards/democards/complex/InlineCardModDemo.java`
      );
      this.fs.delete(
        `src/main/java/${this.modIdCamel}/cards/democards/complex/SelectCardsPlusCardMods.java`
      );
    }

    if (!this.answers.createPowers) {
      this.fs.delete(
        `src/main/resources/${this.answers.modIdPascal.toLowerCase()}Resources/localization/eng/Powerstrings.json`
      );
    }

    if (!this.answers.createChar) {
      this.fs.delete(
        `src/main/resources/${this.answers.modIdPascal.toLowerCase()}Resources/images`
      );
      this.fs.delete(
        `src/main/resources/${this.answers.modIdPascal.toLowerCase()}Resources/localization/eng/Charstrings.json`
      );
    }
  }
};

function toCamelCase(modId) {
  if (modId) {
    let firstChar = modId.charAt(0).toLowerCase();
    let newName = firstChar + modId.slice(1);

    return newName;
  }

  return modId;
}
