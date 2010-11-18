// ************** HELPERS ***************************

Object.countProperties = function(o){
	var i = 0;
	for(var p in o){
		i++;
	}
	return i;
};

Object.clone = function(obj){
    if (typeof(obj) != "object"){
        return obj;
    }
    var clone = new obj.constructor(), props = [], p;
    for(p in obj){
        props.push([p]);
    }
    props.sort();
    for(p=0;p<props.length;p++){
        clone[props[p]] = typeof obj[props[p]] === "object" ? Object.clone(obj[props[p]]) : obj[props[p]];
    }
    return clone;
};

Array.filter = function(arr,filter){
	var ret = [];
	for(var i=0,l=arr.length;i<l;i++){
		if (arr[i]!==filter){
			ret.push(arr[i]);
		}
	}
	return ret;
};

Array.filterAll = function(arr,filter){
	var ret = [];
	for(var i=0,l=arr.length;i<l;i++){
		if (filter.indexOf(arr[i])===-1){
			ret.push(arr[i]);
		}
	}
	return ret;
};

Array.unique = function(arr){
	var ret = [];
	for(var i=0,l=arr.length;i<l;i++){
		if (ret.indexOf(arr[i])===-1){
			ret.push(arr[i]);
		}
	}
	return ret;
};

Array.common = function(arr1,arr2){
	var ret = [];
	arr1.map(function(i){
		if (arr2.indexOf(i)!==-1){
			ret.push(i);
		}
	});
	return ret;
};

Array.equal = function(arr1,arr2){
	if (arr1.length === arr2.length){
		for(var i = 0, l = arr1.length; i<l; i++){
			if (arr1[i]!==arr2[i]){
				return false;
			}
		}
		return true;
	}
	return false;
};

Array.toggle = function(arr,item){
	return arr.indexOf(item) === -1 ? arr.concat([item]) : Array.filter(arr,item); 
};

// *************** LIBRARY **************************


var S = {
	C: {
		success: "SUCCESS",
		hasblock: "HASBLOCK",
		hasanswer: "HASANSWER",
		redundant: "REDUNDANT",
		notfound: "NOTFOUND"
	},
	sud: function(sudstr){
		var sqrs = {}, houses = {}, sqr, sud;
		for(var r=1;r<=9;r++){
			for(var c=1;c<=9;c++){
				sqr = S.sqr(r,c,S.sqr.decideBox(r,c));
				sqrs[sqr.id] = sqr;
			}
		}
		for(var h in S.house.sqrs){
			houses[h] = S.house(h);
		}
		sud = {
			sqrs: sqrs,
			houses: houses,
			turn: -1,
			cascade: true
		};
		if (sudstr){
			for(var s=0;s<=80;s++){
				if(sudstr.substr(s,1)!=="0"){
					S.sud.answer(sud,S.sud.sqrs[s],Number(sudstr.substr(s,1)));
				}
			}
		}
		return sud;
	},
	sqr: function(r,c,b){
	    return {
		    id: "r"+r+"c"+c+"b"+b,
		    r: "r"+r,
		    c: "c"+c,
		    b: "b"+b
	    };
    },
	sel: function(sud,sqrs){
		var ret =  {
			sqrs: [],
			pos: {1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],9:[]},
			sees: [],
			club: [],
			commonCands: [],
			includedCands: [],
			r: [],
			c: [],
			b: []
		};
		if (sud && sqrs){
			sqrs.map(function(sqrid){
				S.sel.add(sud,ret,sqrid);
			});
		}
		return ret;
	},
	house: function(id){
		var pos = {};
		for(var c=1;c<=9;c++){
			pos[c] = [].concat(S.house.sqrs[id]);
		}
		return {
			id: id,
			kind: id.substr(0,1),
			pos: pos,
			rmn: [1,2,3,4,5,6,7,8,9]
		};
	}
};

/******************************* House code **********************************/

S.house.calc = function(sud,hid){
    var house = sud.houses[hid],
	    rmn = [],
		answered = {},
		pos = {1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],9:[]};
	for(var s in S.house.sqrs[hid]){
		var sqr = sud.sqrs[S.house.sqrs[hid][s]];
		if (sqr.ac){
			answered[sqr.ac] = true;
			pos[sqr.ac] = [];
		}
		for(var c=1; c<=9; c++){
			if (!answered[c] && S.sqr.canBe(sqr,c)===S.C.success){
				pos[c].push(sqr.id);
			}
		}
	}
	for(c = 1; c<=9; c++){
		if (!answered[c]){
			rmn.push(c);
		}
	}
	house.rmn = rmn;
	house.pos = pos;
};

/******************************* Sudoku code **********************************/

S.sud.answer = function(sud,sqrid,cand){
	var sqr = sud.sqrs[sqrid],
	    result = S.sqr.canBe(sqr,cand),
		blocks = 0,
		turn = sud.turn;
	if (result === S.C.success){
		S.sqr.answer(sqr,cand,turn);
		["r", "c", "b"].map(function(housetype){
			var h = sud.houses[sqr[housetype]];
			h.rmn.splice(h.rmn.indexOf(cand),1);
			h.pos[cand] = [];
			if (sud.cascade) {
				S.house.sqrs[sqr[housetype]].map(function(friendid){
					blocks += S.sud.block(sud, friendid, cand, housetype) === S.C.success ? 1 : 0;
				});
			}
		});
	}
	// TODO - add blockscount to somewhere, as well as answercount!
	return result;
};

S.sud.unanswer = function(sud,sqrid){
	var sqr = sud.sqrs[sqrid],
	    cand = sqr.ac,
	    result = S.sqr.unanswer(sqr),
		blocks = 0;
	if (result === S.C.success && sud.cascade){
        ["r", "c", "b"].map(function(housetype){
    		S.house.sqrs[sqr[housetype]].map(function(friendid){
				var friend = sud.sqrs[friendid],
				    removed = S.sqr.unblock(friend,cand,housetype); 
			});
		});
	}
	return result;
};

S.sud.block = function(sud,sqrid,cand,kind){
	var sqr = sud.sqrs[sqrid],
	    result = S.sqr.block(sqr,cand,kind,sud.turn);
	if (result === S.C.success){
		["r","c","b"].map(function(housetype){
			var list = sud.houses[sqr[housetype]].pos[cand],
			    pos = list.indexOf(sqr.id);
			list.splice(pos,1);
		});
	}
	// TODO - make it add block to counter somefakkinwhere
};

/******************************* Selection code **********************************/

S.sel.setCands = function(sud,sel){
	if (sel.sqrs.length===1){
		sel.commonCands = sel.includedCands = S.sqr.possibleCands(sud.sqrs[sel.sqrs[0]]);
		return;
	}
	var common = [1,2,3,4,5,6,7,8,9],
	    included = [];
	sel.sqrs.map(function(s){
		var squarecands = S.sqr.possibleCands(sud.sqrs[s]);
		common = Array.common(common,squarecands);
		included = Array.unique(included.concat(squarecands));
	});
	sel.commonCands = common;
	sel.includedCands = included.sort();
};

S.sel.setHouses = function(sud,sel){
	sel.r = [];
	sel.c = [];
	sel.b = [];
	sel.sqrs.map(function(sqrid){
		var s = sud.sqrs[sqrid];
		if (sel.r.indexOf(s.r)===-1){
			sel.r.push(s.r);
		}
		if (sel.c.indexOf(s.c)===-1){
			sel.c.push(s.c);
		}
		if (sel.b.indexOf(s.b)===-1){
			sel.b.push(s.b);
		}
	});
};

S.sel.setCandPositions = function(sud,sel){
    for (var c = 1; c <= 9; c++) {
		sel.pos[c] = [];
		sel.sqrs.map(function(sqrid){
			var s = sud.sqrs[sqrid];
			if (S.sqr.canBe(s,c)){
				sel.pos[c].push(sqrid);
			}
		});
	}
};

S.sel.add = function(sud,sel,sqrid){
	var sqr = sud.sqrs[sqrid];
	if (!sqr){
		throw Error("No square "+sqrid+" found in this sudoku!");
	}
	sel.sqrs.push(sqrid);
	for(var c=1;c<=9;c++){
		if (S.sqr.canBe(sqr,c)===S.C.success){
			sel.pos[c].push(sqrid);
		}
	}
	S.sel.setCands(sud,sel);
	S.sel.setHouses(sud,sel);
};

S.sel.remove = function(sud,sel,sqrid){
	var pos = sel.sqrs.indexOf(sqrid);
	if (pos === -1) {
		return S.C.notfound;
	}
	sel.sqrs.splice(pos,1);
	S.sel.setCandPositions(sud,sel);
	S.sel.setCands(sud,sel);
	S.sel.setHouses(sud,sel);
	return S.C.success;
};

/******************************* Square code **********************************/

S.sqr.decideBox = function(r,c){
	return (3*(Math.floor((r+2) / 3)-1) + Math.floor((c+2) / 3));
};

S.sqr.answer = function(sqr,cand,turn){
	var canbe = S.sqr.canBe(sqr,cand);
	if (canbe === S.C.success) {
		sqr.ac = cand;
		sqr.at = turn;
	}
	return canbe;
};

S.sqr.block = function(sqr,cand,kind,turn){
	if (!sqr){
		throw "WTF?!";
	}
	var first = false;
	if (sqr.ac){
		return S.C.hasanswer;
	}
	if (sqr.blk && sqr.blk[cand] && sqr.blk[cand][kind]){
		return S.C.hasblock;
	}
	if (!sqr.blk){
		sqr.blk = {};
	}
    if (!sqr.blk[cand]){
		sqr.blk[cand] = {};
		first = true;
	}
	sqr.blk[cand][kind] = turn;
	return first ? S.C.success : S.C.redundant;
};

S.sqr.canBe = function(sqr,cand){
	if (sqr.ac){
		return S.C.hasanswer;
	}
	if (sqr.blk && sqr.blk[cand]){
		return S.C.hasblock;
	}
	return S.C.success;
};

S.sqr.remaining = function(sqr){
	if (sqr.ac){
		return [];
	}
	if (sqr.blk === undefined) {
		return [1, 2, 3, 4, 5, 6, 7, 8, 9];
	}
	var r = [], c = 10;
	while(--c){
		if (S.sqr.canBe(sqr,c) === S.C.success){
			r.push(c);
		}
	}
	return r;
};

S.sqr.cssClass = function(sqr){
	var base = sqr.r+" "+sqr.c+" "+sqr.b+" ";
	if (sqr.ac){
		return base+(sqr.at === -1 ? "start":"is")+sqr.ac;
	}
	if (!sqr.blk) {
		return base+"canbe1 canbe2 canbe3 canbe4 canbe5 canbe6 canbe7 canbe8 canbe9";
	}
	return base+S.sqr.remaining(sqr).map(function(i){return "canbe"+i;}).join(" ");
};

S.sqr.unblock = function(sqr,cand,kind){
	if (sqr.blk && sqr.blk[cand] && sqr.blk[cand][kind]){
		delete sqr.blk[cand][kind];
		if (Object.countProperties(sqr.blk[cand])===0){
			delete sqr.blk[cand];
		}
		if (Object.countProperties(sqr.blk)===0){
			delete sqr.blk;
		}
		return S.C.success;
	}
	return S.C.notfound;
};

S.sqr.unanswer = function(sqr){
	if (sqr.ac){
		delete sqr.ac;
		delete sqr.at;
		return S.C.success;
	}
	return S.C.notfound;
};

S.sqr.revert = function(sqr,turn){
	if (sqr.at>turn){
		delete sqr.at;
		delete sqr.ac;
	}
	if (sqr.blk){
		for(var c in sqr.blk){
			for(var k in sqr.blk[c]){
				if (sqr.blk[c][k]>turn){
					delete sqr.blk[c][k];
					if (Object.countProperties(sqr.blk[c])===0){
						delete sqr.blk[c];
					}
				}
			}
		}
		if (Object.countProperties(sqr.blk)===0){
			delete sqr.blk;
		}
	}
};

S.sqr.friends = function(sqr){
	return Array.unique(Array.filter(S.house.sqrs[sqr.r].concat(S.house.sqrs[sqr.c]).concat(S.house.sqrs[sqr.b]),sqr.id));
};

S.sqr.possibleCands = function(sqr){
	if (sqr.ac){
		return [];
	}
	if (!sqr.blk){
		return [1,2,3,4,5,6,7,8,9];
	}
	var cands = [];
	for(var c=1;c<=9;c++){
		if (S.sqr.canBe(sqr,c)===S.C.success){
			cands.push(c);
		}
	}
	return cands;
};

S.house.sqrs = {
	r1: ["r1c1b1","r1c2b1","r1c3b1","r1c4b2","r1c5b2","r1c6b2","r1c7b3","r1c8b3","r1c9b3"],
	r2: ["r2c1b1","r2c2b1","r2c3b1","r2c4b2","r2c5b2","r2c6b2","r2c7b3","r2c8b3","r2c9b3"],
	r3: ["r3c1b1","r3c2b1","r3c3b1","r3c4b2","r3c5b2","r3c6b2","r3c7b3","r3c8b3","r3c9b3"],
	r4: ["r4c1b4","r4c2b4","r4c3b4","r4c4b5","r4c5b5","r4c6b5","r4c7b6","r4c8b6","r4c9b6"],
	r5: ["r5c1b4","r5c2b4","r5c3b4","r5c4b5","r5c5b5","r5c6b5","r5c7b6","r5c8b6","r5c9b6"],
	r6: ["r6c1b4","r6c2b4","r6c3b4","r6c4b5","r6c5b5","r6c6b5","r6c7b6","r6c8b6","r6c9b6"],
	r7: ["r7c1b7","r7c2b7","r7c3b7","r7c4b8","r7c5b8","r7c6b8","r7c7b9","r7c8b9","r7c9b9"],
	r8: ["r8c1b7","r8c2b7","r8c3b7","r8c4b8","r8c5b8","r8c6b8","r8c7b9","r8c8b9","r8c9b9"],
	r9: ["r9c1b7","r9c2b7","r9c3b7","r9c4b8","r9c5b8","r9c6b8","r9c7b9","r9c8b9","r9c9b9"],
	c1: ["r1c1b1","r2c1b1","r3c1b1","r4c1b4","r5c1b4","r6c1b4","r7c1b7","r8c1b7","r9c1b7"],
	c2: ["r1c2b1","r2c2b1","r3c2b1","r4c2b4","r5c2b4","r6c2b4","r7c2b7","r8c2b7","r9c2b7"],
	c3: ["r1c3b1","r2c3b1","r3c3b1","r4c3b4","r5c3b4","r6c3b4","r7c3b7","r8c3b7","r9c3b7"],
	c4: ["r1c4b2","r2c4b2","r3c4b2","r4c4b5","r5c4b5","r6c4b5","r7c4b8","r8c4b8","r9c4b8"],
	c5: ["r1c5b2","r2c5b2","r3c5b2","r4c5b5","r5c5b5","r6c5b5","r7c5b8","r8c5b8","r9c5b8"],
	c6: ["r1c6b2","r2c6b2","r3c6b2","r4c6b5","r5c6b5","r6c6b5","r7c6b8","r8c6b8","r9c6b8"],
	c7: ["r1c7b3","r2c7b3","r3c7b3","r4c7b6","r5c7b6","r6c7b6","r7c7b9","r8c7b9","r9c7b9"],
	c8: ["r1c8b3","r2c8b3","r3c8b3","r4c8b6","r5c8b6","r6c8b6","r7c8b9","r8c8b9","r9c8b9"],
	c9: ["r1c9b3","r2c9b3","r3c9b3","r4c9b6","r5c9b6","r6c9b6","r7c9b9","r8c9b9","r9c9b9"],
	b1: ["r1c1b1","r1c2b1","r1c3b1","r2c1b1","r2c2b1","r2c3b1","r3c1b1","r3c2b1","r3c3b1"],
	b2: ["r1c4b2","r1c5b2","r1c6b2","r2c4b2","r2c5b2","r2c6b2","r3c4b2","r3c5b2","r3c6b2"],
	b3: ["r1c7b3","r1c8b3","r1c9b3","r2c7b3","r2c8b3","r2c9b3","r3c7b3","r3c8b3","r3c9b3"],
	b4: ["r4c1b4","r4c2b4","r4c3b4","r5c1b4","r5c2b4","r5c3b4","r6c1b4","r6c2b4","r6c3b4"],
	b5: ["r4c4b5","r4c5b5","r4c6b5","r5c4b5","r5c5b5","r5c6b5","r6c4b5","r6c5b5","r6c6b5"],
	b6: ["r4c7b6","r4c8b6","r4c9b6","r5c7b6","r5c8b6","r5c9b6","r6c7b6","r6c8b6","r6c9b6"],
	b7: ["r7c1b7","r7c2b7","r7c3b7","r8c1b7","r8c2b7","r8c3b7","r9c1b7","r9c2b7","r9c3b7"],
	b8: ["r7c4b8","r7c5b8","r7c6b8","r8c4b8","r8c5b8","r8c6b8","r9c4b8","r9c5b8","r9c6b8"],
	b9: ["r7c7b9","r7c8b9","r7c9b9","r8c7b9","r8c8b9","r8c9b9","r9c7b9","r9c8b9","r9c9b9"]
};

S.sud.sqrs = [];

for(var r=1; r<=9; r++){
	S.sud.sqrs = S.sud.sqrs.concat(S.house.sqrs["r"+r]);
}

/********************************** Tech code ********************************/

S.techs = {
	check: function(sud,ingr){
		return S.C.success;
	},
	hiddenSingle: {
	    ingredients: {
		    target: {
	    		type: "singleSquare"
		    },
		    cand: {
	    		type: "singleCand"
		    },
		    houseType: {
			    type: "singleHouseType"
	    	}
    	},
		perform: function(sud,ingr){
			S.sud.answer(sud,ingr.target,ingr.cand);
		},
		check: function(sud,ingr){
			var sqr = sud.sqrs[ingr.target],
			    house;
			if (S.sqr.canBe(sqr,ingr.cand)!==S.C.success){
				throw Error("Chosen square cannot be "+ingr.cand+"!");
			}
			house = sud.houses[sqr[ingr.houseType]];
			if (house.pos[ingr.cand].length > 1){
				throw Error("Other squares in the house can also be "+cand+"!");
			}
			return S.C.success;
		},
		find: function(sud){
			for(var hid in sud.houses){
				var house = sud.houses[hid];
				for(var c=1; c<=9; c++){
					if (house.pos[c].length === 1){
						return {
							target: house.pos[c][0],
							cand: c,
							houseType: house.kind
						};
					}
				}
			}
		}
	},
	nakedSingle: {
		ingredients: {
		    target: {
	    		type: "singleSquare"
		    },
		    cand: {
	    		type: "singleCand"
		    }
    	},
		find: function(sud){
			for(var sqrid in sud.sqrs){
				var sqr = sud.sqrs[sqrid],
				    rmn = S.sqr.possibleCands(sqr);
				if (rmn.length === 1){
					return {
						target: sqrid,
						cand: rmn[0]
					};
				}
			}
		},
		check: function(sud,ingr){
			var sqr = sud.sqrs[ingr.target],
			    rmn = S.sqr.possibleCands(sqr);
			if (S.sqr.canBe(sqr,ingr.cand)!==S.C.success){
				throw Error("Target square cannot be "+ingr.cand+"!");
			}
			if (rmn.length>1){
				throw Error("Target square has more possibilities!");
			}
			return S.C.success;
		},
		perform: function(sud,ingr){
			S.sud.answer(sud,ingr.target,ingr.cand);
		}
	},
	hiddenSubset: {
		ingredients: {
			subset: {
				type: "square",
				min: 2
			},
			cands: {
				type: "cand",
				min: 2
			},
			houseType: {
				type: "singleHouseType"
			}
		},
		check: function(sud,ingr){
			var sel = ingr.subset, othersqrs, othersel;
			if (sel[ingr.houseType].length > 1){
				throw Error("Squares do not share that housetype!");
			}
			if (sel.sqrs.length !== ingr.cands.length){
				throw Error("Must be equal number of squares and candidates!");
			}
			sel.sqrs.map(function(sqrid){
				if (Array.common(ingr.cands,S.sqr.possibleCands(sud.sqrs[sqrid])).length === 0){
					throw Error("Subset contains square(s) without any of the candidates!");
				}
			});
			if (Array.equal(sel.includedCands,ingr.cands)){
				throw Error("Subset contains no other candidates, so nothing will be blocked!");
			}
			othersqrs = Array.filterAll(S.house.sqrs[sel[ingr.houseType][0]],sel.sqrs);
			othersel = S.sel(sud,othersqrs);
			if (Array.common(ingr.cands,othersel.includedCands).length){
				throw Error("Candidate(s) exist among other squares in that house!");
			}
			return S.C.success;
		},
		perform: function(sud,ingr){
			ingr.subset.sqrs.map(function(sqrid){
				Array.filterAll([1,2,3,4,5,6,7,8,9],ingr.cands).map(function(c){
					S.sud.block(sud,sqrid,c,"m");
				});
			});
		},
		find: function(sud){
			var MAX = 5;
			for (var hid in S.house.sqrs) {
				var house = sud.houses[hid], sizes = {};
				for (var size = 2; size <= MAX; size++) {
					sizes[size] = [];
					[1,2,3,4,5,6,7,8,9].map(function(cand){
						if (house.pos[cand].length === size){
							sizes[size].push([cand,house.pos[cand]]);
						}
					});
				}
				for (size = 2; size <= MAX; size++) {
					var using = [], num;
					for (i = 2; i <= size; i++) {
						using = using.concat(sizes[i]);
					}
					num = using.length;
					if (num >= size) {
						var combo = [], pos = size - 1;
						// initial using
						for (i = 0; i < size; i++) {
							combo[i] = i;
						}
						while (pos >= 0) {
							if (hid === "r1") {
							}
							while (pos >= 0 && combo[pos] == num - (size - pos)) {
								pos--;
							}
							if (pos >= 0 && combo[pos] < num - (size - pos)) {
								combo[pos]++;
							}
							// collect all positions
							var subsetcands = [], subsetsqrids = [];
							combo.map(function(upos){
								subsetcands.push(using[upos][0]);
								subsetsqrids = Array.unique(subsetsqrids.concat(using[upos][1]));
							});
							if (subsetcands.length === subsetsqrids.length){
								var setsel = S.sel(sud,subsetsqrids);
								if(setsel.includedCands.length>subsetcands.length){ // contains others?
									return {
										subset: setsel, 
										cands: subsetcands,
										houseType: hid.substr(0,1)
									};
								}
							}
						}
					}
				}
			}
		}
	},
	nakedSubset: {
		ingredients: {
			subset: {
				type: "square",
				min: 2
			},
			cands: {
				type: "cand",
				min: 2
			},
			houseType: {
				type: "singleHouseType"
			}
		},
		check: function(sud,ingr){
			var sel = ingr.subset, othersqrs, othersel;
			if (sel[ingr.houseType].length > 1){
				throw Error("Squares do not share that housetype!");
			}
			if (sel.sqrs.length !== ingr.cands.length){
				throw Error("Must be equal number of squares and candidates!");
			}
			if (!Array.equal(sel.includedCands,ingr.cands)){
				throw Error("Subset contains other candidates!");
			}
			othersqrs = Array.filterAll(S.house.sqrs[sel[ingr.houseType][0]],sel.sqrs);
			othersel = S.sel(sud,othersqrs);
			if (Array.common(othersel.includedCands,ingr.cands).length === 0){
				throw Error("Candidates aren't found in the other squares, so nothing will be blocked!");
			}
			return S.C.success;
		},
		perform: function(sud,ingr){
			othersqrs = Array.filterAll(S.house.sqrs[ingr.subset[ingr.houseType][0]],ingr.subset.sqrs);
			othersqrs.map(function(sqrid){
				ingr.cands.map(function(c){
					S.sud.block(sud,sqrid,c,"m");
				});
			});
		},
		find: function(sud){
			var MAX = 5;
			for(var hid in S.house.sqrs){
				var sqrids = S.house.sqrs[hid],
				    sizes= {};
				for(var size = 2; size<=MAX; size++){
					sizes[size] = [];
					for(var i = 0, l = sqrids.length; i<l;i++){
						sqrid = sqrids[i];
						var cands = S.sqr.possibleCands(sud.sqrs[sqrid]);
						if (cands.length === size){
							sizes[size].push([sqrid,cands]);
						}
					}
				}
				for(size = 2;size<=MAX;size++){
					var using = [], num;
					for(i = 2; i<=size;i++){
						using = using.concat(sizes[i]);
					}
					num = using.length;
					if (num>=size){
						var combo = [], pos = size - 1;
						// initial using
						for(i=0;i<size;i++){
							combo[i] = i;
						}						
						while(pos>=0){
							while (pos>=0 && combo[pos] == num-(size-pos)){
								pos--;
							}
							if (pos>=0 && combo[pos] < num-(size-pos)){
								combo[pos]++;
							}
							// collect all cands;
							var subsetcands = [], subsetsqrids = [];
							combo.map(function(upos){
								subsetsqrids.push(using[upos][0]);
								subsetcands = Array.unique(subsetcands.concat(using[upos][1]));
							});
							if (subsetcands.length === subsetsqrids.length){
								var nonsetsel = S.sel(sud,Array.filterAll(S.house.sqrs[hid],subsetsqrids));
								if(Array.common(nonsetsel.includedCands,subsetcands)){ // found in rest?
									return {
										subset: S.sel(sud,subsetsqrids), 
										cands: subsetcands,
										houseType: hid.substr(0,1)
									};
								}
							}
						}
					}
				}
			}
		}
	},
	lockedCandidates: {
		ingredients: {
			squares: {
				type: "square",
				min: 2,
				max: 3
			},
			cand: {
				type: "singleCand"
			},
			candsin: {
				type: "singleHouseType"
			},
			deletefrom: {
				type: "singleHouseType"
			}
		},
		check: function(sud,ingr){
			var candsinOtherSqrs,deletefromOtherSqrs,candsinHID, deletefromHID;
			if ((ingr.candsin !== "b" && ingr.deletefrom !== "b") || (ingr.candsin === "b" && ingr.deletefrom === "b")){
				throw Error("Must select row and box or column and box!");
			}
			if (ingr.squares[ingr.candsin].length !== 1){
				throw Error("Chosen squares do not share that house!");
			}
			if (ingr.squares[ingr.deletefrom].length !== 1){
				throw Error("Chosen squares do not share that house!");
			}
			candsinHID = sud.sqrs[ingr.squares.sqrs[0]][ingr.candsin];
			candsinOtherSqrs = S.sel(sud,Array.filterAll(S.house.sqrs[candsinHID],ingr.squares.sqrs));
			if (candsinOtherSqrs.includedCands.indexOf(ingr.cand)!==-1){
				throw Error("Other squares in "+candsinHID+" can be "+ingr+cand+"!");
			}
			deletefromHID = sud.sqrs[ingr.squares.sqrs[0]][ingr.deletefrom];
			deletefromOtherSqrs = S.sel(sud,Array.filterAll(S.house.sqrs[deletefromHID],ingr.squares.sqrs));
			if (deletefromOtherSqrs.includedCands.indexOf(ingr.cand)===-1){
				throw Error("No square in "+deletefromHID+" can be "+ingr.cand+", so nothing will be blocked!");
			}
			return S.C.success;
		},
		find: function(sud){
			// first type
			for(var type in {r:"foo",c:"bar"}){
				for(var i=1;i<=9;i++){
					var house = sud.houses[type+i];
					for(var c = 1;c<=9;c++){
						if (house.pos[c].length>1 && house.pos[c].length<=3){
							var sqrs = S.sel(sud,house.pos[c]);
							if (sqrs.b.length === 1){
								var othersqrs = S.sel(sud,Array.filterAll(S.house.sqrs[sqrs.b[0]],S.house.sqrs[type+i]));
								if (othersqrs.includedCands.indexOf(c)!==-1){
									return {
										cand: c,
										candsin: type,
										deletefrom: "b",
										squares: sqrs
									};
								}
							}
						}
					}
				}
			}
			// second type
			for(var b=1;b<=9;b++){
				house = sud.houses["b"+b];
				for(c=1;c<=9;c++){
					if (house.pos[c].length > 1 && house.pos[c].length <= 3) {
						sqrs = S.sel(sud, house.pos[c]);
						for(type in {r:"foo",c:"bar"}){
							if(sqrs[type].length === 1){
								othersqrs = S.sel(sud,Array.filterAll(S.house.sqrs[sqrs[type][0]],S.house.sqrs["b"+b]));
								if (othersqrs.includedCands.indexOf(c)!==-1){
									return {
										cand: c,
										candsin: "b",
										deletefrom: type,
										squares: sqrs
									};
								}
							}
						}
					}
				}
			}
			// nothing! :P
			//return S.C.notfound;
		},
		perform: function(sud,ingr){
			(Array.filterAll(S.house.sqrs[ingr.squares[ingr.deletefrom][0]],S.house.sqrs[ingr.squares[ingr.candsin][0]])).map(function(sqrid){
				S.sud.block(sud,sqrid,ingr.cand,"m");
			});
	    }
	},
	fish: {
		ingredients: {
			cand: {
				type: "singleCand"
			},
			orientation: {
				type: "roworcol"
			},
			sel: {
				type: "square"
			}
		},
		check: function(sud,ingr){
			var o = {
				r: {
					other: "c",
					name: "rows"
				},
				c: {
					other: "r",
					name: "columns"
				}
			};
			if (ingr.sel.commonCands.indexOf(ingr.cand) === -1){
				throw Error("Not all selected squares cand be "+ingr.cand+"!");
			}
			if (ingr.sel.r.length !== ingr.sel.c.length){
				throw Error("Squares must share same number of rows and columns!");
			}
			var inlinesqrids = [];
			ingr.sel[ingr.orientation].map(function(hid){
				inlinesqrids = inlinesqrids.concat(S.house.sqrs[hid]);
			});
			inlinesqrids = Array.filterAll(inlinesqrids,ingr.sel.sqrs);
			if (S.sel(sud,inlinesqrids).includedCands.indexOf(ingr.cand)!==-1){
				throw Error(ingr.cand+" can be found in other squares in those "+o[ingr.orientation].name+"!");
			}
			var targetsqrids = [];
			ingr.sel[o[ingr.orientation].other].map(function(hid){
				targetsqrids = targetsqrids.concat(S.house.sqrs[hid]);
			});
			targetsqrids = Array.filterAll(targetsqrids,ingr.sel.sqrs);
			if (S.sel(sud,targetsqrids).includedCands.indexOf(ingr.cand)===-1){
				throw Error(ingr.cand+" cannot be found in other squares in those "+o[o[ingr.orientation].other].name+"!");
			}
		},
		find: function(sud){
			var MAX = 5;
			for(var orientation in {r:"FOO",c:"BAR"}){
				for(var cand = 1; cand<=9; cand++){
					var sizes = {};
					for(var size=2;size<=MAX;size++){
					    sizes[size] = [];
						for(var i=1;i<=9;i++){
							var hid = orientation+i, possqrids = sud.houses[hid].pos[cand];
							if (possqrids.length === size){
								sizes[size].push([hid,possqrids]);
							}
						}
					}
                    for(size = 2;size<=MAX;size++){
					    var using = [], num;
					    for(i = 2; i<=size;i++){
    						using = using.concat(sizes[i]);
	    				}
		    			num = using.length;
			    		if (num >= size) {
							var combo = [], pos = size - 1;
							// initial using
							for (i = 0; i < size; i++) {
								combo[i] = i;
							}
							while (pos >= 0) {
								while (pos >= 0 && combo[pos] == num - (size - pos)) {
									pos--;
								}
								if (pos >= 0 && combo[pos] < num - (size - pos)) {
									combo[pos]++;
								}
								var fishsqrids = [], fishsel;
								combo.map(function(upos){
									fishsqrids = fishsqrids.concat(using[upos][1]);
								});
								fishsel = S.sel(sud,fishsqrids);
								if (fishsel.r.length === fishsel.c.length){
									var targetsqrids = [], targetsel;
									fishsel[orientation==="r"?"c":"r"].map(function(hid){
										targetsqrids = targetsqrids.concat(S.house.sqrs[hid]);
									});
									targetsqrids = Array.filterAll(targetsqrids,fishsqrids);
									targetsel = S.sel(sud,targetsqrids);
									if (targetsel.includedCands.indexOf(cand)!==-1){
										return {
											cand: cand,
											orientation: orientation,
											sel: fishsel
										};
									}
								} 
							}
						}
					}
				}
			}
		}
	}
};

/********************************** UI code ********************************/

S.UI = {
	selectTech: function(sud, tech){
		sud.currentTech = tech;
		sud.pickedIngredients = {};
	},
	selectIngredient: function(sud, ingr){
		if (S.techs[sud.currentTech] && S.techs[sud.currentTech].ingredients && S.techs[sud.currentTech].ingredients[ingr]) {
			sud.currentIngredient = ingr;
			return;
		}
		throw "What the heck?";
	},
	pickIngredient: function(sud,type,id){
		var ingr = S.techs[sud.currentTech].ingredients[sud.currentIngredient],
		    picked = sud.pickedIngredients[sud.currentIngredient];
		switch(type){
			case "cand":
			    if (ingr.type === "singleCand"){
					sud.pickedIngredients[sud.currentIngredient] = id;
				}
				if (ingr.type === "cand"){
					if (!picked) {
						sud.pickedIngredients[sud.currentIngredient] = [id];
					}
					else {
						sud.pickedIngredients[sud.currentIngredient] = Array.toggle(sud.pickedIngredients[sud.currentIngredient],id);
					}
				}
			    break;
			case "square":
			    if (ingr.type === "singleSquare"){
					sud.pickedIngredients[sud.currentIngredient] = id;
				}
                if (ingr.type === "square"){
					if (!picked) {
						sud.pickedIngredients[sud.currentIngredient] = [id];
					}
					else {
						sud.pickedIngredients[sud.currentIngredient] = Array.toggle(sud.pickedIngredients[sud.currentIngredient],id);
					}
				}
			    break;
		}
	}
};