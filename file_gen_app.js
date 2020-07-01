const fs = require('fs');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
readline.question('Please Enter How many file you want to create( N ) : ', async totalfile =>  {
let filestatus = await createfile(totalfile);
readline.close();
});

async function createfile(totalfile)
{
var files = [];
for (var i = 1; i <= totalfile; ++i) {
    files.push(fs.writeFileSync("data/file-" + i + ".txt", "Hello "+i, "utf-8"));
}
Promise.all(files).then(function() {
    console.log("Generated successfully");
});
}
