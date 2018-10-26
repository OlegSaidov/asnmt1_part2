//copyright-2018 Oleg Saidov, Website Engineering, prof. Alfred Rezk
// form path ./editor/index.html
//fieldnames filename, textfield


//import modules, querystring, fs, path, and http
var http = require('http');
var fs = require('fs');
var path = require('path');
var {parse} = require('querystring');

var server = http.createServer((req, res) => {
    
    var formPath = path.join(process.cwd(), req.url);
    var formMethod = req.method;
    console.log(formMethod);

    if(formMethod =='POST'){

        processForm();

        }else{               
        
        sendPage();    
            
            };//method check                 
                    



function processForm() {

    var formBody = "";
    req.on("data", (chunk) => {
        formBody+=chunk.toString();
         }); 

    req.on("end", () => {
        var fileName = parse(formBody).filename;
        var textContent = parse(formBody).textfield;
        console.log(fileName);
        
        fs.appendFile(fileName,textContent, (err) => {
            if(err) throw error;
            res.writeHead(200,{'Content-Type':'text/html'});
            res.write(`<h3>Your file named ${fileName} is safe and sound.</h3>`);
            res.end();
           

           
        });
    });

}

function sendPage() {
    if(fs.existsSync(formPath)){
        console.log(formPath); 
        fs.stat(formPath, (err, stats) => {
                if(err) {throw error;}
                else if(stats.isFile()){       
       
                    
                        fs.readFile(formPath, (err, data) =>{
                            if(err) throw error;
                            res.writeHead(200,{'Content-Type': 'text/html'});
                            var fileStream = fs.createReadStream(formPath);
                            fileStream.pipe(res);


                        });//readFile                  

                }else if(stats.isDirectory()){
                    console.log(`${formPath}  is a path to a directory not a file!`);
                    res.writeHead(404, {"Content-Type":"text/html"});
                    res.write("<h1>What you're requesting is a directory. Page not found, error 404.</h1><sub>Hint: Try <i>index.html</i></sub>");
                    res.end();
                    
                }else{
                    console.log(`${formPath}  caused internal server error!`);
                    res.writeHead(500, {"Content-Type":"text/html"});
                    res.write("<h1>You're breaking my server! Error 500</h1>");
                    res.end();

                } ;

        });//fs.stat 

    }else{
    console.log(`${formPath} doesn't exists!`);
    res.writeHead(404, {"Content-Type":"text/html"});
    res.write("<h1>Page not found, error 404</h1>");
    res.end();
    

    };//exitsSync
}

   
}); //createServer
server.listen(6000);