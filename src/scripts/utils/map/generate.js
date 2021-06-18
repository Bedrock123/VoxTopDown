
const standardMapLayout = [{
    type: "entrance",
    children: [
        {
            type: "normal",
            children: [
                {
                    type: "normal",
                    children: [
                        {
                            type: "hub",
                            children: [
                                {
                                    type: "normal",
                                    children: [
                                        {
                                            type: "normal",
                                        },
                                        {
                                            type: "normal",
                                            children: [
                                                {
                                                    type: "reward",
                                                    children: null
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    type: "normal",
                                    children: [
                                        {
                                            type: "hub",
                                            children: [
                                                {
                                                    type: "boss_foyer",
                                                    children: [
                                                        {
                                                            type: "boss",
                                                            children: [
                                                                {
                                                                    type: "boss_exit_room"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    type: "normal",
                                                    children: [
                                                        {
                                                            type: "normal",
                                                            children: [
                                                                {
                                                                    type:"reward"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    type: "connector",
                                                    children: [
                                                        {
                                                            type: "shop",
                                                            children: null
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                            ]       
                        }
                    ]       
                }
            ]       
        }
    ]
}]

function randomRoomSize() {
    const standardSize = 100
    let width = parseInt(Math.random() * standardSize)
    let length  = parseInt(Math.random() * standardSize)
    return [width, length]
}


var indent = 1;
function walk(tree) {
	tree.forEach(function(node) {
		console.log(Array(indent).join('-'), node.type);
        

        node.size = randomRoomSize()
		if(node.children) {
			indent ++;
			walk(node.children);
		}
		if(tree.indexOf(node) === tree.length - 1) {
			indent--;
		}
	})
}


function createGround(width, height){
    var result = [];
    for (var i = 0 ; i < width; i++) {
        result[i] = [];
        for (var j = 0; j < height; j++) {
            result[i][j] = (Math.random() * 5 | 0) + 6;
        }
    }
    return result;
}
// Create a new ground with width = 15 & height = 9

function Generate() {
    
    
    walk(standardMapLayout)
    var ground = createGround(100, 100);

}


export default Generate