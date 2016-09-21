<!DOCTYPE html>
<html>
    <head>
        <title>XKCD Password Generator</title>
        <link rel="stylesheet" href="css/cscie3.css">
        <!-- Latest compiled and minified CSS -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
        <!-- Optional theme -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">

        <!--Local CSS file-->
        <link rel="stylesheet" href="css/my_style.css">

        <!--PHP logic file-->
        <?php require 'logic.php'; ?>

    </head>
    <body>
        <div class="container">
            <div class="container-fluid-1 bg-1 text-center bottom-buffer">
                <h1>Project P2: XKCD Style Password Generation</h1>
                <h3><a href="http://p1.guddi.ca">Back to Project P1<h3>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="well">
                        <h4>Select your options from the list below:</h4>
                        <form class="form-horizontal" action="index.php" method="GET">
                            <div class="form-group">
                                <label class="control-label col-sm-2" for="tot-words">Total words:</label>
                                <div class="col-sm-10">
                                    <select class="form-control" id="tot-words" name="tot-words">
                                        <option value = "2" <?php if(isset($_GET['tot-words']) && $_GET['tot-words'] == '2') echo "selected";?>>2</option>
                                        <option value = "3" <?php if(isset($_GET['tot-words']) && $_GET['tot-words'] == '3') echo "selected";?>>3</option>
                                        <option value = "4" <?php if(isset($_GET['tot-words']) && $_GET['tot-words'] == '4') echo "selected";?>>4</option>
                                        <option value = "5" <?php if(isset($_GET['tot-words']) && $_GET['tot-words'] == '5') echo "selected";?>>5</option>
                                        <option value = "6" <?php if(isset($_GET['tot-words']) && $_GET['tot-words'] == '6') echo "selected";?>>6</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="control-label col-sm-2" for="tot-sp-chars">Total symbols (from !, @, #, $, %, ^, &, *):</label>
                                <div class="col-sm-10">
                                    <select class="form-control" id="tot-sp-chars" name="tot-sp-chars">
                                        <option value="1" <?php if(isset($_GET['tot-sp-chars']) && $_GET['tot-sp-chars'] == '1') echo "selected";?>>1</option>
                                        <option value="2" <?php if(isset($_GET['tot-sp-chars']) && $_GET['tot-sp-chars'] == '2') echo "selected";?>>2</option>
                                        <option value="3" <?php if(isset($_GET['tot-sp-chars']) && $_GET['tot-sp-chars'] == '3') echo "selected";?>>3</option>
                                        <option value="4" <?php if(isset($_GET['tot-sp-chars']) && $_GET['tot-sp-chars'] == '4') echo "selected";?>>4</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="control-label col-sm-2" for="tot-numbers">Total numbers:</label>
                                <div class="col-sm-10">
                                    <select class="form-control" id="tot-numbers" name="tot-numbers">
                                        <option value="1" <?php if(isset($_GET['tot-numbers']) && $_GET['tot-numbers'] == '1') echo "selected";?>>1</option>
                                        <option value="2" <?php if(isset($_GET['tot-numbers']) && $_GET['tot-numbers'] == '2') echo "selected";?>>2</option>
                                        <option value="3" <?php if(isset($_GET['tot-numbers']) && $_GET['tot-numbers'] == '3') echo "selected";?>>3</option>
                                        <option value="4" <?php if(isset($_GET['tot-numbers']) && $_GET['tot-numbers'] == '4') echo "selected";?>>4</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="control-label col-sm-2" for="use-separator">Separator:</label>
                                <div class="col-sm-10">
                                    <select class="form-control" id="use-separator" name="use-separator">
                                        <option value="-" <?php if(isset($_GET['use-separator']) && $_GET['use-separator'] == '-') echo "selected";?>>-</option>
                                        <option value="!" <?php if(isset($_GET['use-separator']) && $_GET['use-separator'] == '!') echo "selected";?>>!</option>
                                        <option value="@" <?php if(isset($_GET['use-separator']) && $_GET['use-separator'] == '@') echo "selected";?>>@</option>
                                        <option value="#" <?php if(isset($_GET['use-separator']) && $_GET['use-separator'] == '#') echo "selected";?>>#</option>
                                        <option value="$" <?php if(isset($_GET['use-separator']) && $_GET['use-separator'] == '$') echo "selected";?>>$</option>
                                        <option value="%" <?php if(isset($_GET['use-separator']) && $_GET['use-separator'] == '%') echo "selected";?>>%</option>
                                        <option value="^" <?php if(isset($_GET['use-separator']) && $_GET['use-separator'] == '^') echo "selected";?>>^</option>
                                        <option value="&" <?php if(isset($_GET['use-separator']) && $_GET['use-separator'] == '&') echo "selected";?>>&</option>
                                        <option value="*" <?php if(isset($_GET['use-separator']) && $_GET['use-separator'] == '*') echo "selected";?>>*</option>
                                        <option value="space" <?php if(isset($_GET['use-separator']) && $_GET['use-separator'] == 'space') echo "selected";?>>Space</option>
                                        <option value="none" <?php if(isset($_GET['use-separator']) && $_GET['use-separator'] == 'none') echo "selected";?>>No Separator</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="control-label col-sm-2" for="word-case">Word Case:</label>
                                <div class="col-sm-10">
                                    <select class="form-control" id="word-case" name="word-case">
                                        <option value="upper" <?php if(isset($_GET['word-case']) && $_GET['word-case'] == 'upper') echo "selected";?>>UPPER</option>
                                        <option value="lower" <?php if(isset($_GET['word-case']) && $_GET['word-case'] == 'lower') echo "selected";?>>lower</option>
                                        <option value="camel" <?php if(isset($_GET['word-case']) && $_GET['word-case'] == 'camel') echo "selected";?>>Camel</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="col-sm-offset-2 col-sm-10">
                                    <label><input type="checkbox" name="save-preference" value="save" id="save-preference" <?php if(isset($_GET['save-preference']) && $_GET['save-preference'] == 'save') echo "checked";?>>Save my preference!</label>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="col-sm-offset-2 col-sm-10">
                                    <button type="submit" class="btn btn-default">Generate Password</button>
                                </div>
                            </div>
                        </form>
                        <h4>Suggested Password: <mark><?php if (isset($suggestedPassword)) {echo $suggestedPassword;} ?></mark></h4>
                        <h4><?php if (isset($error)){echo $error;} ?></h4>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="well">
                        <h1><a href='http://xkcd.com/936/'>Inspiration</a></h1><br>
                        <a href='http://xkcd.com/936/'  class='visible-md-block visible-lg-block'>
                            <img src='http://imgs.xkcd.com/comics/password_strength.png' alt='xkcd password strength visually'>
                        </a><br>

                    </div>
                </div>
            </div>
            <div class="container-fluid-2 bg-1 text-center top-buffer">
                <h3>Project P2</h3>
                <h3>CSCI E-15 Dynamic Web Applications Course Projects</h3>
                <h3>Harvard Extension School</h3>
            </div>
        </div>

        <!-- Latest compiled and minified JavaScript -->
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
        <script type="text/javascript" src="js/utility.js"></script>
        <script type="text/javascript" src="js/xkcd_pw.js"></script>
    </body>
</html>
