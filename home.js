var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
var source;
var destination;
var destinationRepoPath;
var fse = require("fs-extra");
var fs = require("fs");
const junk = require("junk");
var mkdirp = require("mkdirp");
var destinationRepository;
var createFlag = true;
app.set("view engine", "ejs");
global.lb1 = "";
global.lb2 = "";
global.lb3 = "";
global.lb4 = "";
global.CheckrepoPath = "";
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/home.html"));
});
app.use(bodyParser.urlencoded({ extended: false }));
app.post("/", function(req, res) {
  console.log(req.baseUrl);
  var s = req.body.getbutton;
  switch (s) {
    case "6":
      //textbox1-->local path
      //textbox2-->Repopath
      console.log("before Creating Repo");
      source = req.body.textbox1; //localpath
      destinationRepoPath = req.body.textbox2; //repopath
      destinationRepository = req.body.textbox3; //reponame
      if (
        source.trim() != "" &&
        destinationRepoPath.trim() != "" &&
        destinationRepository.trim() != ""
      ) {
        //hn026636140;
        //destination = destinationRepoPath + "/" + destinationRepository;
        if (fs.existsSync(source) && fs.existsSync(destinationRepoPath)) {
          destination = destinationRepoPath + "\\" + destinationRepository;
          createManifestFile(
            source,
            destinationRepository,
            false,
            destination,
            destinationRepoPath,
            destinationRepoPath,
            function(err, data) {
              if (err) {
                console.log("Error While Creating Repo:" + err);
                res.render("message", {
                  msg: "Error While Creating Repo.Please enter correct data."
                });
              }
              //res.send("Successfully created repo at " + destinationRepoPath);
              else
                res.render("message", {
                  msg: "Successfully created repo at " + destinationRepoPath
                });
            }
          );
        } else {
          res.render("message", {
            msg: "Error While Creating Repo.Please enter correct data."
          });
        }
      } else {
        res.render("message", {
          msg:
            "Fields are blank. Please reselect appropriate button and re-enter values."
        });
      }
      break;

    case "7":
      //textbox1-->local path
      //textbox2-->Repopath
      sourceRepository = req.body.textbox1;
      destinationRepoPath = req.body.textbox2;
      //destinationRepository = req.body.textbox3;
      lb1 = req.body.lbn1;
      lb2 = req.body.lbn2;
      lb3 = req.body.lbn3;
      lb4 = req.body.lbn4;
      if (
        sourceRepository.trim() != "" &&
        destinationRepoPath.trim() != "" &&
        //destinationRepository.trim() != "" &&
        lb1.trim() != "" &&
        lb2.trim() != "" &&
        lb3.trim() != "" &&
        lb4.trim() != ""
      ) {
        if (
          fs.existsSync(sourceRepository) &&
          fs.existsSync(destinationRepoPath)
        ) {
          timeStamp = Date.now();
          if (destinationRepoPath.charAt(destinationRepoPath.length - 1) != "/")
            destinationRepoPath = destinationRepoPath + "/";
          createSnapshot(
            sourceRepository,
            destinationRepository,
            false,
            timeStamp,
            destinationRepoPath,
            destinationRepoPath,
            function(err, data) {
              //createSnapshot(sourceRepository, destinationRepoPath, function(err, data) {
              destinationRepoPath = destinationRepoPath.substring(
                0,
                destinationRepoPath.length - 2
              );
              if (err) {
                console.log(
                  "Error while checking in the code at " + destinationRepoPath
                );
                res.render("message", {
                  msg:
                    "Error while Checking in the code.Please enter correct data."
                });
              } else
                res.render("message", {
                  msg:
                    "Successfully checked-in the code at " + destinationRepoPath
                });
            }
          );
        } else {
          res.render("message", {
            msg: "Error while Checking in the code.Please enter correct data."
          });
        }
      } else {
        res.render("message", {
          msg:
            "Fields are blank. Please reselect appropriate button and re-enter values."
        });
      }

      break;
    case "8":
      //checkout();
      var LabelName = req.body.textbox3;
      var localPath = req.body.textbox1;
      var Repopath = req.body.textbox2;
      CheckrepoPath = req.body.textbox2;
      //var man_fileName=null;

      console.log("LabelName:" + LabelName);
      console.log("localPath:" + localPath);
      console.log("Repopath:" + Repopath);
      if (LabelName.trim() != "" && localPath.trim() != "" && Repopath.trim()) {
        if (fs.existsSync(localPath) && fs.existsSync(Repopath)) {
          checkout(LabelName, localPath, Repopath, function(err, data) {
            // if ((err.code = "ENOENT")) {
            if (err) {
              console.log("Error while checking out the code at " + localPath);
              res.render("message", {
                msg:
                  "Details are incorrect.Please verify and re-enter correct data. "
              });
            } else
              res.render("message", {
                msg: "Successfully checked-out the code at " + localPath
              });
          });
        } else {
          console.log("Error while checking out the code at " + localPath);
          res.render("message", {
            msg:
              "Details are incorrect.Please verify and re-enter correct data. "
          });
        }
      } else {
        res.render("message", {
          msg:
            "Fields are blank. Please reselect appropriate button and re-enter values."
        });
      }
      break;
    case "10":
      //label
      console.log("in label");
      var labeldata;
      var Labelfilepath = req.body.textbox2;

      var str = Labelfilepath.split("\\");
      //	"D:\\MS\\CSULB\\Sem 1\\CECS 543_SoftwareEngineering\\Project\\Repo\\MojoProject\\Label.txt";
      try {
        labeldata = fs.readFileSync(Labelfilepath + "\\Label.txt", "utf8");
      } catch (e) {
        if (e.code == "ENOENT")
          labeldata = "File not found.Please check and reenter correct path.";
        else labeldata = "Enter a valid path.";
        console.log(e);
      }

      console.log(labeldata);

      // app.set("view engine", "ejs");
      res.render("label", {
        data: labeldata.split("\n"),
        ProjectName: str[str.length - 1]
      });
      //res.send(labeldata);
      break;

    case "12":
      //CreateANewlabel();
      var LabelName = req.body.textbox3;
      var oldLabl_ManifestName = req.body.textbox1;
      var Repopath = req.body.textbox2;
      //var man_fileName=null;

      console.log("LabelName:" + LabelName);
      console.log("oldLabl_ManifestName:" + oldLabl_ManifestName);
      console.log("Repopath:" + Repopath);
      if (
        LabelName.trim() != "" &&
        oldLabl_ManifestName.trim() != "" &&
        Repopath.trim() != ""
      ) {
        if (fs.existsSync(Repopath)) {
          if (
            oldLabl_ManifestName.lastIndexOf("Manifest_") == -1 &&
            fs
              .readFileSync(Repopath + "\\Label.txt")
              .toString()
              .lastIndexOf(oldLabl_ManifestName) != -1
          ) {
            CreateANewlabel(LabelName, oldLabl_ManifestName, Repopath, function(
              err,
              data
            ) {
              // if ((err.code = "ENOENT")) {
              if (err) {
                console.log("Error while creating a label. ");
                res.render("message", {
                  msg:
                    "Details are incorrect.Please verify and re-enter correct data. "
                });
              } else
                res.render("message", {
                  msg: "New label added."
                });
            });
          } else if (!fs.existsSync(Repopath + oldLabl_ManifestName + ".txt")) {
            res.render("message", {
              msg:
                "Label or Manifest file Name is incorrect.Please verify and re-enter correct data. "
            });
          } else {
            res.render("message", {
              msg:
                "Label or Manifest file Name is incorrect.Please verify and re-enter correct data. "
            });
          }
        } else {
          console.log("Incorrect Repo path ");
          res.render("message", {
            msg: "Incorrect Repo path! Please verify and try again."
          });
        }
      } else {
        res.render("message", {
          msg:
            "Fields are blank. Please reselect appropriate button and re-enter values."
        });
      }
      break;

    case "13":
      var localPath = req.body.textbox1;
      var Repopath = req.body.textbox2;
      if (labelpath.trim() != "" && Repopath.trim() != "") {
        mergeIn(Repopath, localPath);
      } else {
        res.render("message", {
          msg:
            "Fields are blank. Please reselect appropriate button and re-enter values."
        });
      }
      break;

    case "14":
      //Merge-In

      //textbox1-->Repopath
      //textbox2-->local
      MergeSrcPath = req.body.textbox1;

      destinationRepoPath = req.body.textbox2;

      if (MergeSrcPath.trim() != "" && destinationRepoPath.trim() != "") {
        if (fs.existsSync(MergeSrcPath) && fs.existsSync(destinationRepoPath)) {
          timeStamp = Date.now();
          if (destinationRepoPath.charAt(destinationRepoPath.length - 1) != "/")
            destinationRepoPath = destinationRepoPath + "/";
          merge(
            MergeSrcPath,
            destinationRepository,
            false,
            timeStamp,
            destinationRepoPath,
            destinationRepoPath,
            function(err, data) {
              if (err) {
                console.log(
                  "Error while merging the code at " + destinationRepoPath
                );
                res.render("message", {
                  msg: "Error while merging the code.Please enter correct data."
                });
              } else
                res.render("message", {
                  msg: "Successfully merged the code at " + destinationRepoPath
                });
            }
          );
        } else {
          res.render("message", {
            msg: "Error while merging the code.Please enter correct data."
          });
        }
      } else {
        res.render("message", {
          msg:
            "Fields are blank. Please reselect appropriate button and re-enter values."
        });
      }

      break;

    case "18":
      var x = req.body.textbox4;
      var value = new Array();
      value = x.split(" ");
      console.log(value.length);
      for (let i = 0; i < value.length; i++) console.log(value[i]);
      if (value[0] == "createrepo") {
        if (value.length == 4) {
          console.log("before Creating Repo");
          source = value[1]; //localpath
          destinationRepoPath = value[2]; //repopath
          destinationRepository = value[3]; //reponame
          if (
            source.trim() != "" &&
            destinationRepoPath.trim() != "" &&
            destinationRepository.trim() != ""
          ) {
            //hn026636140;
            //destination = destinationRepoPath + "/" + destinationRepository;
            if (fs.existsSync(source) && fs.existsSync(destinationRepoPath)) {
              destination = destinationRepoPath + "\\" + destinationRepository;
              createManifestFile(
                source,
                destinationRepository,
                false,
                destination,
                destinationRepoPath,
                destinationRepoPath,
                function(err, data) {
                  if (err) {
                    console.log("Error While Creating Repo:" + err);
                    res.render("message", {
                      msg:
                        "Error While Creating Repo.Please enter correct data."
                    });
                  }
                  //res.send("Successfully created repo at " + destinationRepoPath);
                  else
                    res.render("message", {
                      msg: "Successfully created repo at " + destinationRepoPath
                    });
                }
              );
            } else {
              res.render("message", {
                msg: "Error While Creating Repo.Please enter correct data."
              });
            }
          } else {
            res.render("message", {
              msg:
                "Fields are blank. Please reselect appropriate button and re-enter values."
            });
          }
        } else {
          res.render("message", {
            msg:
              'Invalid Format! Please enter "createrepo" command with its arguments in proper format.'
          });
        }
      } else if (value[0] == "checkin") {
        if (value.length == 3) {
          //textbox1-->local path
          //textbox2-->Repopath
          sourceRepository = value[1];
          destinationRepoPath = value[2];
          //destinationRepository = req.body.textbox3;
          lb1 = req.body.lbn1;
          lb2 = req.body.lbn2;
          lb3 = req.body.lbn3;
          lb4 = req.body.lbn4;
          if (
            sourceRepository.trim() != "" &&
            destinationRepoPath.trim() != "" &&
            //destinationRepository.trim() != "" &&
            lb1.trim() != "" &&
            lb2.trim() != "" &&
            lb3.trim() != "" &&
            lb4.trim() != ""
          ) {
            if (
              fs.existsSync(sourceRepository) &&
              fs.existsSync(destinationRepoPath)
            ) {
              timeStamp = Date.now();
              if (
                destinationRepoPath.charAt(destinationRepoPath.length - 1) !=
                "/"
              )
                destinationRepoPath = destinationRepoPath + "/";
              createSnapshot(
                sourceRepository,
                destinationRepository,
                false,
                timeStamp,
                destinationRepoPath,
                destinationRepoPath,
                function(err, data) {
                  //createSnapshot(sourceRepository, destinationRepoPath, function(err, data) {
                  destinationRepoPath = destinationRepoPath.substring(
                    0,
                    destinationRepoPath.length - 2
                  );
                  if (err) {
                    console.log(
                      "Error while checking in the code at " +
                        destinationRepoPath
                    );
                    res.render("message", {
                      msg:
                        "Error while Checking in the code.Please enter correct data."
                    });
                  } else
                    res.render("message", {
                      msg:
                        "Successfully checked-in the code at " +
                        destinationRepoPath
                    });
                }
              );
            } else {
              res.render("message", {
                msg:
                  "Error while Checking in the code.Please enter correct data."
              });
            }
          } else {
            res.render("message", {
              msg:
                "Fields are blank. Please reselect appropriate button and re-enter values."
            });
          }
        } else {
          res.render("message", {
            msg:
              'Invalid Format! Please enter "checkin" command with its arguments in proper format.'
          });
        }
      } else if (value[0] == "checkout") {
        if (value.length == 4) {
          //checkout();
          var LabelName = value[1];
          var localPath = value[2];
          var Repopath = value[3];
          CheckrepoPath = value[3];
          //var man_fileName=null;

          console.log("LabelName:" + LabelName);
          console.log("localPath:" + localPath);
          console.log("Repopath:" + Repopath);
          if (
            LabelName.trim() != "" &&
            localPath.trim() != "" &&
            Repopath.trim()
          ) {
            if (fs.existsSync(localPath) && fs.existsSync(Repopath)) {
              checkout(LabelName, localPath, Repopath, function(err, data) {
                // if ((err.code = "ENOENT")) {
                if (err) {
                  console.log(
                    "Error while checking out the code at " + localPath
                  );
                  res.render("message", {
                    msg:
                      "Details are incorrect.Please verify and re-enter correct data. "
                  });
                } else
                  res.render("message", {
                    msg: "Successfully checked-out the code at " + localPath
                  });
              });
            } else {
              console.log("Error while checking out the code at " + localPath);
              res.render("message", {
                msg:
                  "Details are incorrect.Please verify and re-enter correct data. "
              });
            }
          } else {
            res.render("message", {
              msg:
                "Fields are blank. Please reselect appropriate button and re-enter values."
            });
          }
        } else {
          res.render("message", {
            msg:
              'Invalid Format! Please enter "checkout" command with its arguments in proper format.'
          });
        }
      } else if (value[0] == "displaylabels") {
        if (value.length == 2) {
          console.log("in label");
          var labeldata;
          var Labelfilepath = value[1];

          var str = Labelfilepath.split("\\");
          //	"D:\\MS\\CSULB\\Sem 1\\CECS 543_SoftwareEngineering\\Project\\Repo\\MojoProject\\Label.txt";
          try {
            labeldata = fs.readFileSync(Labelfilepath + "\\Label.txt", "utf8");
          } catch (e) {
            if (e.code == "ENOENT")
              labeldata =
                "File not found.Please check and reenter correct path.";
            else labeldata = "Enter a valid path.";
            console.log(e);
          }

          console.log(labeldata);

          // app.set("view engine", "ejs");
          res.render("label", {
            data: labeldata.split("\n"),
            ProjectName: str[str.length - 1]
          });
        } else {
          res.render("message", {
            msg:
              'Invalid Format! Please enter "displaylabels" command with its arguments in proper format.'
          });
        }
      } else if (value[0] == "createlabel") {
        if (value.length == 4) {
          //CreateANewlabel();
          var LabelName = value[1];
          var oldLabl_ManifestName = value[2];
          var Repopath = value[3];
          //var man_fileName=null;

          console.log("LabelName:" + LabelName);
          console.log("oldLabl_ManifestName:" + oldLabl_ManifestName);
          console.log("Repopath:" + Repopath);
          if (
            LabelName.trim() != "" &&
            oldLabl_ManifestName.trim() != "" &&
            Repopath.trim()
          ) {
            if (fs.existsSync(Repopath)) {
              if (
                oldLabl_ManifestName.lastIndexOf("Manifest_") == -1 &&
                fs
                  .readFileSync(Repopath + "\\Label.txt")
                  .toString()
                  .lastIndexOf(oldLabl_ManifestName) != -1
              ) {
                CreateANewlabel(
                  LabelName,
                  oldLabl_ManifestName,
                  Repopath,
                  function(err, data) {
                    // if ((err.code = "ENOENT")) {
                    if (err) {
                      console.log("Error while creating a label. ");
                      res.render("message", {
                        msg:
                          "Details are incorrect.Please verify and re-enter correct data. "
                      });
                    } else
                      res.render("message", {
                        msg: "New label added."
                      });
                  }
                );
              } else if (
                !fs.existsSync(Repopath + oldLabl_ManifestName + ".txt")
              ) {
                res.render("message", {
                  msg:
                    "Label or Manifest file Name is incorrect.Please verify and re-enter correct data. "
                });
              } else {
                res.render("message", {
                  msg:
                    "Label or Manifest file Name is incorrect.Please verify and re-enter correct data. "
                });
              }
            } else {
              console.log("Incorrect Repo path ");
              res.render("message", {
                msg: "Incorrect Repo path! Please verify and try again."
              });
            }
          } else {
            res.render("message", {
              msg:
                "Fields are blank. Please reselect appropriate button and re-enter values."
            });
          }
        } else {
          res.render("message", {
            msg:
              'Invalid Format! Please enter "createlabel" command with its arguments in proper format.'
          });
        }
      } else if (value[0] == "mergeout") {
        if (value.length == 3) {
          var localPath = value[1];
          var Repopath = value[2];
          if (labelpath.trim() != "" && Repopath.trim() != "") {
            mergeIn(Repopath, localPath);
          } else {
            res.render("message", {
              msg:
                "Fields are blank. Please reselect appropriate button and re-enter values."
            });
          }
        } else {
          res.render("message", {
            msg:
              'Invalid Format! Please enter "mergeout" command with its arguments in proper format.'
          });
        }
      } else if (value[0] == "mergein") {
        if (value.length == 3) {
          //Merge-In

          //textbox1-->Repopath
          //textbox2-->local
          MergeSrcPath = value[1];

          destinationRepoPath = value[2];

          if (MergeSrcPath.trim() != "" && destinationRepoPath.trim() != "") {
            if (
              fs.existsSync(MergeSrcPath) &&
              fs.existsSync(destinationRepoPath)
            ) {
              timeStamp = Date.now();
              if (
                destinationRepoPath.charAt(destinationRepoPath.length - 1) !=
                "/"
              )
                destinationRepoPath = destinationRepoPath + "/";
              merge(
                MergeSrcPath,
                destinationRepository,
                false,
                timeStamp,
                destinationRepoPath,
                destinationRepoPath,
                function(err, data) {
                  if (err) {
                    console.log(
                      "Error while merging the code at " + destinationRepoPath
                    );
                    res.render("message", {
                      msg:
                        "Error while merging the code.Please enter correct data."
                    });
                  } else
                    res.render("message", {
                      msg:
                        "Successfully merged the code at " + destinationRepoPath
                    });
                }
              );
            } else {
              res.render("message", {
                msg: "Error while merging the code.Please enter correct data."
              });
            }
          } else {
            res.render("message", {
              msg:
                "Fields are blank. Please reselect appropriate button and re-enter values."
            });
          }
        } else {
          res.render("message", {
            msg:
              'Invalid Format! Please enter "mergein" command with its arguments in proper format.'
          });
        }
      } else {
        res.render("message", {
          msg: "Invalid Command!"
        });
      }

      break;
  }

  // res.sendStatus(200);
});

app.listen(3000, function() {
  // Set callback action fcn on network port.
  console.log("home.js listening on port 3000!");
});

//Creates a directory in the path with the given name
var createDir = (base, destinationRepository) => {
  console.log("Destinatiion name" + destinationRepository);
  //mkdirp(base, function (err) {
  //	if (err) console.error(err)
  //	else console.log('pow!')
  //});

  //Include the fs, path modules
  console.log("base---" + base);
  var fs = require("fs");
  var path = require("path");
  process.chdir(base);
  var response;
  if (!fs.existsSync(destinationRepository)) {
    fs.mkdirSync(destinationRepository, 0755);
    response = fs.existsSync(destinationRepository)
      ? "Successfully created: " + destinationRepository
      : "Unable to create: " + destinationRepository;
  }
  return response;
};
//Creates Manifest file and copies the content of the file to the file in the destination
function createManifestFile(
  sourceRepository,
  destinationRepository,
  isFolder,
  manifestDestination,
  destinationRepoPath,
  destinationRepoPath,
  done
) {
  //Creates a folder called 'DestinationRepository' in the directory where this file is located
  if (createFlag) {
    console.log("destinationRepospath----" + destinationRepoPath);
    var mkdir = createDir(destinationRepoPath, destinationRepository);
    console.log(
      "Repository successfully created with the name: DestinationRepository in the path :" +
        destinationRepoPath
    );
    createFlag = false;
  }
  if (isFolder) {
    var mkdir = createDir(destination, destinationRepository);

    destination = destination + "\\" + destinationRepository;
    isFolder = false;
  }
  let listOfFiles = [];
  fs.readdir(sourceRepository, function(error, list) {
    if (error) return done(error);
    var numberOfFiles = list.length;
    console.log("Number of files in the Source Directory:" + numberOfFiles);
    console.log(list.filter(junk.not));
    if (!numberOfFiles) return done(null, listOfFiles);
    list.forEach(function(file) {
      console.log(file);
      //Ignoring meta files
      if (!junk.is(file)) {
        file = path.resolve(sourceRepository, file);
        fs.stat(file, function(err, stat) {
          //Checking if its a directory and executing a recursive call for all the files in the directory
          if (stat && stat.isDirectory()) {
            // Add directory to array
            listOfFiles.push(file);
            var subfolderPath = file.substring(file.lastIndexOf("\\") + 1);
            console.log("subfolder path" + subfolderPath);
            createManifestFile(
              file,
              subfolderPath,
              true,
              manifestDestination,
              destinationRepoPath,
              function(err, res) {
                listOfFiles = listOfFiles.concat(res);
                if (!--numberOfFiles) done(null, listOfFiles);
                if (err) {
                  return console.log("Error in creating manifest file");
                }
              }
            );
          }
          // If it is a file create manifest file with artifact id as the name
          else {
            var artifact = checksum(file, function(error, r) {
              if (error) {
                return console.log(
                  "Error in creating checksum for the file: " + file
                );
              }
            });
            //Changing the present working directory from source repository to the destination repository
            console.log("Destination ----" + destination);
            process.chdir(destination);
            var filename = path.basename(file);

            //Creating file inside destination repository
            mkdirp(filename, function(err) {});
            //Reading contents of the file
            var contents = fs.readFileSync(file, "utf8");
            artifactData =
              "Timestamp : " +
              new Date() +
              "\r\nArtifact ID : " +
              artifact +
              "\r\nCommand : Create - Repo" +
              "\r\nURL of the source file :" +
              file;
            console.log("---------Filename:-----" + filename);
            var contentOfTheFile = contents;
            //Writing contents of the file in the destination repository
            fs.writeFileSync(
              //hn026636140
              //filename + "/" + artifact + ".txt".toString(),
              filename + "\\" + artifact + ".txt".toString(),
              contentOfTheFile,
              function(error) {
                if (error) throw error;
              }
            );
            if (
              fs.existsSync(
                manifestDestination +
                  "/" +
                  "Manifest" +
                  "_create_command.txt".toString()
              )
            ) {
              artifactData = "\n\r" + artifactData;
            }
            fs.appendFileSync(
              manifestDestination +
                "/" +
                "Manifest" +
                "_create_command.txt".toString(),
              artifactData
            );
            listOfFiles.push(file);
            if (!--numberOfFiles) done(null, listOfFiles);
          }
          if (err) {
            return console.log("Check Paths of Source and Destination");
          }
        });
      }
    });
  });
}

// Generate  check-sum of file
function checksum(file, done) {
  var contents = fs.readFileSync(file, "utf8");
  var data = contents.split("");
  console.log(data);
  var result = 0;
  var j = 0;
  var arr = [1, 7, 3, 7, 11];
  for (i = 0; i < data.length; i++) {
    result += parseInt(arr[j]) * parseInt(contents.charCodeAt(i));
    if (j == 4) j = 0;
    else j++;
  }
  var aa = fs.statSync(file);
  var size = aa["size"];
  var fname = result + "-L" + size;
  return fname;
}
//Add label in the labels file
function addLabel(snapshotName, labelName) {
  // include node fs module
  console.log("inside create label");
  var fs = require("fs");

  // writeFile function with filename, content and callback function
  fs.appendFileSync(
    "label.txt",
    snapshotName + "-" + labelName + "\n",
    function(err) {
      if (err) throw err;
      console.log("File is created successfully.");
    }
  );
}

//Check in functionality
function createSnapshot(
  sourceRepository,
  destinationRepository,
  isFolder,
  timeStamp,
  destination,
  manifestPath,
  done
) {
  var manifestFileName;
  console.log("Inside snapshot");
  console.log(manifestPath);
  if (isFolder) {
    //var mkdir = createDir(destination, destinationRepository);
    //hn026636140
    //destination = destination + "/" + destinationRepository;
    destination = destination + "\\" + destinationRepository;
    isFolder = false;
  }
  let listOfFiles = [];
  fs.readdir(sourceRepository, function(error, list) {
    if (error) return done(error);
    var numberOfFiles = list.length;
    console.log("Number of files in the Source Directory:" + numberOfFiles);
    console.log(list.filter(junk.not));
    if (!numberOfFiles) return done(null, listOfFiles);
    list.forEach(function(file) {
      console.log(file);
      //Ignoring meta files
      if (!junk.is(file)) {
        file = path.resolve(sourceRepository, file);
        fs.stat(file, function(err, stat) {
          //Checking if its a directory and executing a recursive call for all the files in the directory
          if (stat && stat.isDirectory()) {
            // Add directory to array
            listOfFiles.push(file);
            //hn026636140
            //var subfolderPath = file.substring(file.lastIndexOf("/") + 1);
            var subfolderPath = file.substring(file.lastIndexOf("\\") + 1);
            console.log("subfolder path" + subfolderPath);
            createSnapshot(
              file,
              subfolderPath,
              true,
              timeStamp,
              destination,
              manifestPath,
              function(err, res) {
                listOfFiles = listOfFiles.concat(res);
                if (!--numberOfFiles) done(null, listOfFiles);
              }
            );
          }
          // If it is a file create manifest file with artifact id as the name
          else {
            var artifact = checksum(file, function(error, r) {
              if (error) {
                return console.log(
                  "Error in creating checksum for the file: " + file
                );
              }
            });
            //Changing the present working directory from source repository to the destination repository
            console.log("------------------" + destination);
            process.chdir(destination);
            console.log("heloooooo----------------");
            var filename = path.basename(file);
            //Creating file inside destination repository
            mkdirp(filename, function(err) {});
            //Reading contents of the file
            var contents = fs.readFileSync(file, "utf8");
            artifactData =
              "Timestamp : " +
              new Date() +
              "\r\nArtifact ID : " +
              artifact +
              "\r\nCommand : Checkin" +
              "\r\nURL of the source file :" +
              file;
            var contentOfTheFile = contents;
            console.log("till here --------");
            //Writing contents of the file in the destination repository
            //hn026636140
            //if(fs.exists(filename + "/" + artifact + ".txt".toString()))

            fs.writeFileSync(
              filename + "/" + artifact + ".txt".toString(),
              contentOfTheFile,
              function(error) {
                if (error) throw error;
              }
            );
            //suchitra
            if (
              fs.existsSync(
                manifestPath +
                  "\\" +
                  "Manifest" +
                  "_checkin" +
                  timeStamp +
                  ".txt".toString()
              )
            ) {
              artifactData = "\n\r" + artifactData;
            }
            fs.appendFileSync(
              manifestPath +
                "\\" +
                "Manifest" +
                "_checkin" +
                timeStamp +
                ".txt".toString(),
              artifactData
            );
            console.log("till here --------" + manifestPath);
            manifestFileName = "Manifest" + "_checkin" + timeStamp;
            //   fs.appendFileSync(
            //     manifestPath + "/" + manifestFileName + ".txt".toString(),
            //     artifactData
            //   );
            //CreateOrAppendtoLabelFile(manifestFileName, manifestPath);
            console.log("till here --------11111");
            listOfFiles.push(file);
            if (!--numberOfFiles) {
              CreateOrAppendtoLabelFile(manifestFileName, manifestPath);
              done(null, listOfFiles);
            }
          }
          if (error) {
            return console.log("Check paths of source and destination");
          }
        });
      }
    });
  });
}

//Create/update Label file to store the label values entered by the user. Label file has label to manifestfile mapping.
function CreateOrAppendtoLabelFile(manifestFileName, manifestPath) {
  var data;
  var lastIndex;
  var lastlabelNum = parseInt("0");
  if (
    manifestPath.charAt(manifestPath.length - 1) == "/" ||
    manifestPath.charAt(manifestPath.length - 1) == "\\"
  ) {
    manifestPath = manifestPath.substring(0, manifestPath.length - 1);
    console.log("--->" + manifestPath);
  }
  var labelpath = manifestPath + "\\Label.txt";
  if (fs.existsSync(labelpath)) {
    fs.appendFileSync(
      labelpath,
      "\n" +
        manifestFileName +
        "-" +
        lb1 +
        "\n" +
        manifestFileName +
        "-" +
        lb2 +
        "\n" +
        manifestFileName +
        "-" +
        lb3 +
        "\n" +
        manifestFileName +
        "-" +
        lb4
    );
  } else {
    fs.appendFileSync(
      labelpath,

      manifestFileName +
        "-" +
        lb1 +
        "\n" +
        manifestFileName +
        "-" +
        lb2 +
        "\n" +
        manifestFileName +
        "-" +
        lb3 +
        "\n" +
        manifestFileName +
        "-" +
        lb4
    );
  }
}

//check out functionality
function checkout(LabelName, localPath, Repopath, done) {
  //Repopath = Repopath + "\\Label.txt";
  var manifest_file_name;
  var manifest_file_path;
  var ArtifactId;
  var file_name;
  var timestp = Date.now();
  var isFolder = false;
  var Repo_file_path;
  var Repo_Subfolder_path;
  //var Repo_Subfolder_path;
  var local_file_path;
  var subfoldersfilename;
  var files = new Array();

  //if (fs.existsSync(Repopath + "\\Label.txt")) {
  try {
    if (LabelName.lastIndexOf("Manifest") != -1) {
      manifest_file_name = LabelName;
      console.log("manifest_file_name:" + manifest_file_name);
    } else {
      var fdata = fs
        .readFileSync(Repopath + "\\Label.txt")
        .toString()
        .split("\n");
      fdata.forEach(data => {
        if (data.lastIndexOf(LabelName) != -1) {
          manifest_file_name = data.substring(
            0,
            data.lastIndexOf(LabelName) - 1
          );
          console.log("Manifest file name:" + manifest_file_name);
        }
      });
    }

    var file1 = fs.readdirSync(Repopath);

    for (let i in file1) {
      console.log(file1[i]);
      if (
        file1[i].substring(0, 9) == "Manifest_" ||
        file1[i].substring(0, 5) == "Label"
      ) {
        console.log("---------------here------");
        //file.splice(file[i], 1);
      } else {
        files.push(file1[i]);
        console.log("f:" + file1[i]);
      }
    }

    manifest_file_path = Repopath + "\\" + manifest_file_name + ".txt";
    console.log("manifest_file_path:" + manifest_file_path);
    //if (fs.existsSync(manifest_file_path)) {
    var Mandata = fs
      .readFileSync(manifest_file_path)
      .toString()
      .split("\n");
    // Mandata.forEach((element, list) =>
    var p = 0;
    var map = new Object();
    //filecount=0;
    for (var i = 0; i < Mandata.length; i++) {
      if (Mandata[i].lastIndexOf("Artifact ID : ") != -1) {
        ArtifactId = Mandata[i]
          .substring(Mandata[i].lastIndexOf(":") + 1)
          .trim();
        console.log("ArtifactId:" + ArtifactId);
        //var extension;

        if (Mandata[i + 2].lastIndexOf("URL of the source file :") != -1) {
          file_name = Mandata[i + 2].slice(
            parseInt(Mandata[i + 2].lastIndexOf("\\") + 1),
            parseInt(Mandata[i + 2].lastIndexOf("Timestamp") + parseInt("1")) ==
              0
              ? Mandata[i + 2].length
              : parseInt(Mandata[i + 2].lastIndexOf("Timestamp"))
          );
          console.log("file_name:" + file_name);

          if (files.lastIndexOf(file_name) == -1) {
            // filenames in subfolders mappped to ther artifactId
            map[file_name] = ArtifactId;
            continue;
          } else {
            files.splice(file_name, 1);
          }

          var Repo_file_path =
            Repopath + "\\" + file_name + "\\" + ArtifactId + ".txt";
          var local_file_path = localPath + "\\" + file_name;

          console.log("Repo_file_path:" + Repo_file_path);
          console.log("local_file_path:" + local_file_path);
          copyFile(Repo_file_path, local_file_path);
          //Create Checkout manifest file

          createNewCheckOutManifest(
            Repopath,
            // CheckrepoPath,
            local_file_path,
            ArtifactId,
            timestp
          );
        }
      }
    }
    //creating subfolders
    if (map.length > 0)
      creating_subfolder(files, Repopath, localPath, map, timestp);

    done(null, "successfull");
  } catch (e) {
    console.log(e);
    console.log("Label file not found!");
    done(e, null);
  }
}

function creating_subfolder(files, Repopath, localPath, map, timestp) {
  if (files.length > 0) {
    for (var subf in files) {
      //Repopath_withSubf = Repopath + "\\" + subf;
      process.chdir(localPath);
      if (
        !fs.existsSync(localPath + "\\" + files[subf]) &&
        map[files[subf]] == null
      ) {
        fs.mkdirSync(localPath + "\\" + files[subf]);
        console.log("--------here---------");
      }
      var subpath = files[subf];

      if (map[files[subf]] == null) {
        var f = fs.readdirSync(Repopath + "\\" + subpath);
        console.log("---xxx----" + Repopath + "\\" + subpath);
        for (var item in f) {
          console.log("--" + Repopath + "\\" + subpath + "\\" + f[item]);
          fs.stat(Repopath + "\\" + subpath + "\\" + f[item], function(
            err,
            data
          ) {
            console.log("----------here ------" + data);
            if (data.isDirectory) {
              console.log("file does not exist:" + f[item]);
              //process.chdir(localPath)
              if (map[f[item]] == null) {
                if (
                  !fs.existsSync(
                    localPath + "\\" + files[subf] + "\\" + f[item]
                  )
                ) {
                  fs.mkdirSync(localPath + "\\" + files[subf] + "\\" + f[item]);
                }
                subpath = subpath + "\\" + f[item];
                creating_subfolder(
                  fs.readdirSync(Repopath + "\\" + subpath),
                  Repopath + "\\" + subpath,
                  localPath + "\\" + subpath,
                  map,
                  timestp
                );
              } else {
                console.log("Writing sufolder file");
                createNewCheckOutManifest(
                  // Repopath,
                  CheckrepoPath,
                  localPath + "\\" + subpath + "\\" + f[item],
                  // ArtifactId,
                  map[f[item]],
                  timestp
                );
                copyFile(
                  Repopath +
                    "\\" +
                    subpath +
                    "\\" +
                    f[item] +
                    "\\" +
                    map[f[item]] +
                    ".txt",
                  localPath + "\\" + subpath + "\\" + f[item]
                );
              }
            }
          });
        }
      } else {
        console.log("Writing sufolder file");
        createNewCheckOutManifest(
          // Repopath,
          CheckrepoPath,
          localPath + "\\" + subpath,
          // ArtifactId,
          map[files[subf]],
          timestp
        );
        copyFile(
          Repopath + "\\" + subpath + "\\" + map[files[subf]] + ".txt",
          localPath + "\\" + subpath
        );
      }
    }
  }
}

function copyFile(Repo_file_path, local_file_path) {
  //if(fs.existsSync(local_file_path))
  // var freadStream = fs.createReadStream(Repo_file_path, "utf8");
  // console.log("freadStream" + freadStream);
  // var fwriteStream = fs.createWriteStream(local_file_path);
  // freadStream.pipe(fwriteStream);
  // console.log("in file copy");
  try {
    var readfile = fs.readFileSync(Repo_file_path, "utf8");
    fs.appendFileSync(local_file_path, readfile);
  } catch (e) {
    console.log(e);
  }
}

//To create a new manifest file in Repo while checking out the code
function createNewCheckOutManifest(
  Repopath,
  local_file_path,
  ArtifactId,
  timestp
) {
  console.log(timestp);
  var checkout_manifest_File_path =
    Repopath + "\\Manifest_Checkout" + timestp + ".txt";
  console.log("checkout_manifest_File_path" + checkout_manifest_File_path);
  var Manifest_checkout_data;
  if (!fs.existsSync(checkout_manifest_File_path)) {
    Manifest_checkout_data =
      "Timestamp : " +
      new Date() +
      "\nArtifact ID : " +
      ArtifactId +
      "\nCommand : Checkout" +
      "\nURL of the Destination file :" +
      local_file_path;
    fs.appendFileSync(checkout_manifest_File_path, Manifest_checkout_data);
  } else {
    Manifest_checkout_data =
      "\nTimestamp : " +
      new Date() +
      "\nArtifact ID : " +
      ArtifactId +
      "\nCommand : Checkout" +
      "\nURL of the Destination file :" +
      local_file_path;
    fs.appendFileSync(checkout_manifest_File_path, Manifest_checkout_data);
  }
}

function CreateANewlabel(LabelName, oldLabl_ManifestName, Repopath, done) {
  var manifest_file_name;
  try {
    if (oldLabl_ManifestName.lastIndexOf("Manifest_") != -1) {
      manifest_file_name = oldLabl_ManifestName;
      console.log("manifest_file_name:" + manifest_file_name);
    } else {
      var fdata = fs
        .readFileSync(Repopath + "\\Label.txt")
        .toString()
        .split("\n");
      fdata.forEach(data => {
        if (data.lastIndexOf(oldLabl_ManifestName) != -1) {
          manifest_file_name = data.substring(
            0,
            data.lastIndexOf(oldLabl_ManifestName) - 1
          );
          console.log("Manifest file name:" + manifest_file_name);
        }
      });
    }
    var labelpath = Repopath + "\\Label.txt";
    var data = fs.readFileSync(labelpath);
    if (fs.existsSync(labelpath)) {
      fs.appendFileSync(labelpath, "\n" + manifest_file_name + "-" + LabelName);
    } else {
      fs.appendFileSync(
        labelpath,

        manifest_file_name + "-" + LabelName
      );
    }
    done(null, "successfull");
  } catch (e) {
    console.log("Error while creating label:" + e);
    done(e, null);
  }
}

//Merge functionality
function merge(
  sourceRepository,
  destinationRepository,
  isFolder,
  timeStamp,
  destination,
  manifestPath,
  done
) {
  var manifestFileName;
  console.log("Inside snapshot");
  console.log(manifestPath);
  if (isFolder) {
    //var mkdir = createDir(destination, destinationRepository);
    //hn026636140
    //destination = destination + "/" + destinationRepository;
    destination = destination + "\\" + destinationRepository;
    isFolder = false;
  }
  let listOfFiles = [];
  fs.readdir(sourceRepository, function(error, list) {
    if (error) return done(error);
    var numberOfFiles = list.length;
    console.log("Number of files in the Source Directory:" + numberOfFiles);
    console.log(list.filter(junk.not));
    if (!numberOfFiles) return done(null, listOfFiles);
    list.forEach(function(file) {
      console.log(file);
      //Ignoring meta files
      if (!junk.is(file)) {
        file = path.resolve(sourceRepository, file);
        fs.stat(file, function(err, stat) {
          //Checking if its a directory and executing a recursive call for all the files in the directory
          if (stat && stat.isDirectory()) {
            // Add directory to array
            listOfFiles.push(file);
            //hn026636140
            // var subfolderPath = file.substring(file.lastIndexOf("/") + 1);
            var subfolderPath = file.substring(file.lastIndexOf("\\") + 1);
            console.log("subfolder path" + subfolderPath);
            merge(
              file,
              subfolderPath,
              true,
              timeStamp,
              destination,
              manifestPath,
              function(err, res) {
                listOfFiles = listOfFiles.concat(res);
                if (!--numberOfFiles) done(null, listOfFiles);
              }
            );
          }
          // If it is a file create manifest file with artifact id as the name
          else {
            var artifact = checksum(file, function(error, r) {
              if (error) {
                return console.log(
                  "Error in creating checksum for the file: " + file
                );
              }
            });
            //Changing the present working directory from source repository to the destination repository
            console.log("------------------" + destination);
            process.chdir(destination);
            console.log("heloooooo----------------");
            var filename = path.basename(file);
            //Creating file inside destination repository
            mkdirp(filename, function(err) {});
            //Reading contents of the file
            var contents = fs.readFileSync(file, "utf8");
            artifactData =
              "Timestamp : " +
              new Date() +
              "\r\nArtifact ID : " +
              artifact +
              "\r\nCommand : MergeIn" +
              "\r\nURL of the source file :" +
              file;
            var contentOfTheFile = contents;
            console.log("till here --------");
            //Writing contents of the file in the destination repository
            //hn026636140
            //if(fs.exists(filename + "/" + artifact + ".txt".toString()))

            fs.writeFileSync(
              filename + "\\" + artifact + ".txt".toString(),
              contentOfTheFile,
              function(error) {
                if (error) throw error;
              }
            );
            //hn026636140
            var merge_manifestpath =
              manifestPath +
              "\\" +
              "Manifest" +
              "_mergeIn" +
              timeStamp +
              ".txt".toString();

            if (!fs.existsSync(merge_manifestpath)) {
              //suchitra
              fs.appendFileSync(merge_manifestpath, artifactData);
            } else {
              artifactData = "\n\r" + artifactData.toString();
              fs.appendFileSync(merge_manifestpath, artifactData);
            }
            console.log("till here --------" + manifestPath);
            //  manifestFileName = "Manifest" + "_mergeIn" + timeStamp;
            //  fs.appendFileSync(
            //   manifestPath + "/" + manifestFileName + ".txt".toString(),
            //   artifactData
            //);
            //CreateOrAppendtoLabelFile(manifestFileName, manifestPath);
            console.log("till here --------11111");
            listOfFiles.push(file);
            if (!--numberOfFiles) {
              // CreateOrAppendtoLabelFile(manifestFileName, manifestPath);
              done(null, listOfFiles);
            }
          }
          if (error) {
            return console.log("Check paths of source and destination");
          }
        });
      }
    });
  });
}

function mergeIn(destinationRepoPath, sourceRepopath) {
  var latestCheckInManifestName;
  var latestCheckOutManifestName;
  console.log("inside merge in");
  const path = require("path");
  const fs = require("fs");
  //joining path of directory
  //const directoryPath = path.join(__dirname, 'Documents');
  //passsing directoryPath and callback function
  fs.readdir(destinationRepoPath, function(err, files) {
    //handling error
    if (err) {
      return console.log(
        "The path mentioned is not present, please recheck" + err
      );
    }
    filesList = files.filter(function(e) {
      return (
        path.extname(e).toLowerCase() === ".txt" &&
        e.indexOf("Manifest_checkin") > -1
      );
    });
    //listing all files using forEach

    console.log(filesList);
    var recentTime = 0;

    filesList.forEach(function(file) {
      // file.slice(0, 15) + file.slice(29, file.length);
      if (file.substring(16, 29) > recentTime) {
        recentTime = file.substring(16, 29);
        latestCheckInManifestName = file;
      }
      console.log(+file.substring(16, 29));
    });
    console.log("latestCheckInManifestName" + latestCheckInManifestName);

    //Read latest manifest file
    var manifestData = fs
      .readFileSync(destinationRepoPath + "/" + latestCheckInManifestName)
      .toString()
      .split("\n");
    console.log(manifestData);

    // Mandata.forEach((element, list) =>
    var p = 0;
    for (var i = 0; i < manifestData.length; i++) {
      if (manifestData[i].lastIndexOf("Artifact ID : ") != -1) {
        ArtifactId = manifestData[i]
          .substring(manifestData[i].lastIndexOf(":") + 1)
          .trim();
        console.log("ArtifactId:" + ArtifactId);

        if (manifestData[i + 2].lastIndexOf("URL of the") != -1) {
          file_name = manifestData[i + 2].slice(
            parseInt(manifestData[i + 2].indexOf(":") + 1),
            parseInt(manifestData[i + 2].length)
          );
          var filePathInSource = file_name;
          var filePathInDestination = filePathInSource.replace(
            sourceRepopath,
            destinationRepoPath
          );

          fs.copyFile(
            filePathInSource.toString().replace("\r", ""),
            filePathInSource
              .toString()
              .slice(0, filePathInSource.indexOf(".")) + "-MT.txt",
            err => {
              if (err) throw err;
              console.log("source.txt was copied to destination.txt");
            }
          );

          //fs.copyFile(filePathInDestination.replace("\r",""), filePathInSource.toString().slice(0, filePathInSource.indexOf('.'))+"-MT.txt", (err) => {
          // if (err) throw err;
          //console.log('source.txt was copied to destination.txt');
          //});
          var copyPath =
            filePathInSource
              .toString()
              .slice(0, filePathInSource.indexOf(".")) + "-MR.txt";
          fs.copyFile(
            (
              filePathInDestination.toString() +
              "/" +
              ArtifactId +
              ".txt"
            ).replace("\r", ""),
            copyPath,
            err => {
              if (err) throw err;
              console.log("source.txt was copied to destination.txt");
            }
          );
        }
      }
    }
  });

  console.log("Starting new block------------------------------");

  fs.readdir(destinationRepoPath, function(err, files) {
    //handling error
    if (err) {
      return console.log(
        "The path mentioned is not present, please recheck" + err
      );
    }
    filesList = files.filter(function(e) {
      return (
        path.extname(e).toLowerCase() === ".txt" &&
        e.indexOf("Manifest_Checkout") > -1
      );
    });
    //listing all files using forEach

    console.log(filesList);
    var recentTime = 0;

    filesList.forEach(function(file) {
      // file.slice(0, 15) + file.slice(29, file.length);
      if (file.substring(17, 30) > recentTime) {
        recentTime = file.substring(16, 29);
        console.log("file" + file);
        latestCheckOutManifestName = file;
      }
      console.log(+file.substring(16, 29));
    });
    console.log("latestCheckOutManifestName" + latestCheckOutManifestName);

    //Read latest manifest file
    var manifestData = fs
      .readFileSync(destinationRepoPath + "/" + latestCheckOutManifestName)
      .toString()
      .split("\n");
    console.log(manifestData);

    // Mandata.forEach((element, list) =>
    var p = 0;
    for (var i = 0; i < manifestData.length; i++) {
      if (manifestData[i].lastIndexOf("Artifact ID : ") != -1) {
        ArtifactId = manifestData[i]
          .substring(manifestData[i].lastIndexOf(":") + 1)
          .trim();
        console.log("ArtifactId:" + ArtifactId);

        if (
          manifestData[i + 2].lastIndexOf("URL of the Destination file :") != -1
        ) {
          console.log("inside if");
          file_name = manifestData[i + 2].slice(
            parseInt(manifestData[i + 2].lastIndexOf(":") + 1),
            parseInt(manifestData[i + 2].length)
          );
          var filePathInSource = file_name;
          var filePathInDestination = filePathInSource.replace(
            sourceRepopath,
            destinationRepoPath
          );
          var copyPath =
            filePathInSource
              .toString()
              .slice(0, filePathInSource.indexOf(".")) + "-MC.txt";
          console.log("Copy Path" + copyPath);
          fs.copyFile(
            (
              filePathInDestination.toString() +
              "/" +
              ArtifactId +
              ".txt"
            ).replace("\r", ""),
            copyPath,
            err => {
              if (err) throw err;
              console.log("source.txt was copied to destination.txt11");
            }
          );
        }
      }
    }
  });
}

/*function writeFileSyncRecursive(filename, content, charset) {
              const folders = filename.split(path.sep).slice(0, -1)
              if (folders.length) {
                // create folder path if it doesn't exist
                folders.reduce((last, folder) => {
                  const folderPath = last ? last + path.sep + folder : folder
                  if (!fs.existsSync(folderPath)) {
                    fs.mkdirSync(folderPath)
                  }
                  return folderPath
                })
              }
              fs.writeFileSync(filename, content, charset)
            } */
