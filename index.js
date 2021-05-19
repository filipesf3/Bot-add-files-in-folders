var xlsx = require('node-xlsx');
var fs = require('fs-js');
var excel = "./Produtos Kit Instrumental.xlsx"
var imagesPath = "./uploads/materiais/exemplos/"
var newPath = null
var obj = xlsx.parse(fs.readFileSync(excel))[0]
arrayImages = []


for (elem in obj.data) {
    if (testFileExists(obj.data[elem][1]) === -1) {
        console.log('error in file: ' + obj.data[elem][1])
        continue
    }
    if (newDirectory((parseInt(elem) + 1)) === -1) {
        console.log('error in directory ' + elem + 1)
        break
    }
    newPath = imagesPath + (parseInt(elem) + 1) + '/' + obj.data[elem][1]
    arrayImages.push({
        nome: obj.data[elem][0],
        image: obj.data[elem][1],
        paste: (parseInt(elem) + 1),
        imagensDeMaterial: [{
            id: (parseInt(elem) + 1),
            caminho: newPath
        }],
    })
}


sortArray(arrayImages)

for (elem in arrayImages) {
    moveFiles(imagesPath + arrayImages[elem].image, (imagesPath + '/' + (parseInt(elem) + 1) + '/' + arrayImages[elem].image))
    arrayImages[elem] = {
        id: (parseInt(elem) + 1),
        nome: arrayImages[elem].nome,
        imagensDeMaterial: {
            id: (parseInt(elem) + 1),
            caminho: (imagesPath + '/' + (parseInt(elem) + 1) + '/' + arrayImages[elem].image)
        }
    }


}
console.log(arrayImages)
writeToFile(arrayImages, './uploads/materiais/array.txt')

function sortArray(array) {
    array.sort(function (a, b) {
        return (a.nome > b.nome) ? 1 : ((b.nome > a.nome) ? -1 : 0);
    });
}

function writeToFile(array, path) {
    fs.appendFile(path, JSON.stringify(array), function (err) {
        if (err) throw err;
        console.log('Saved!');
    });

}

function testFileExists(file) {
    try {
        if (fs.existsSync(imagesPath + file))
            return 1
        return -1
    } catch (err) {
        return -1
    }
}

function newDirectory(name) {
    fs.mkdir(imagesPath + name, function (err) {
        if (err)
            return -1
        return 1
    })
}

function moveFiles(oldPath, newPath) {
    fs.rename(oldPath, newPath, function (err) {
        if (err) throw err
    })
}