TestCase("Object property counter",{
	setUp: function(){
		this.c = Object.countProperties;
	},
	"test should be defined":function(){
		assertFunction(this.c);
	},
	"test should return number of properties":function(){
		assertEquals(0,this.c({}));
		assertEquals(1,this.c({foo:"bar"}));
		assertEquals(2,this.c({bar:"baz",foo:"bar"}));
	}
});

TestCase("Array filter",{
	"test should be defined": function(){
		assertFunction(Array.filter);
	},
	"test should exclude the filter obj": function(){
		assertEquals([1,2,3,5],Array.filter([1,2,3,4,5],4));
	}
});

TestCase("Array filterAll",{
	"test should be defined": function(){
		assertFunction(Array.filterAll);
	},
	"test should return 1st array minus all elements in the second": function(){
		assertEquals([1,3,5],Array.filterAll([1,2,3,4,5],[2,4]));
	}
});

TestCase("Array unique",{
	"test should be defined": function(){
		assertFunction(Array.unique);
	},
	"test should return array minus doubles": function(){
		assertEquals([1,2,3,4,5],Array.unique([1,1,1,2,2,2,2,3,4,4,4,4,5]));
	}
});

TestCase("Array common",{
	"test should be defined": function(){
		assertFunction(Array.common);
	},
	"test should return array with elements common to both args": function(){
		assertEquals([3,4,5],Array.common([1,2,3,4,5],[3,4,5,6,7]));
	}
});

TestCase("Array.equal",{
	"test should be defined": function(){
		assertFunction(Array.equal);
	},
	"test should return false for two arrays of different length": function(){
		assertFalse(Array.equal([1,2,3],[1,2,3,4,5]));
	},
	"test should return false for two arrays with different content": function(){
		assertFalse(Array.equal([1,2,3],[1,2,4]));
	},
	"test should return true for two arrays with same content": function(){
		assertTrue(Array.equal([1,2,3],[1,2,3]));
	}
});

TestCase("Array.toggle",{
	"test should be defined": function(){
		assertFunction(Array.toggle);
	},
	"test should add element if doesn't exist": function(){
		var arr = [1,2,3], item = 4;
		assertEquals([1,2,3,4],Array.toggle(arr,item));
	},
	"test should remove element if it already exists": function(){
		var arr = [1,2,3], item = 2;
		assertEquals([1,3],Array.toggle(arr,item));
	}
});

TestCase("Object clone",{
	setUp: function(){
		this.o = {foo:"bar",baz:{mee:"woo",arr:[1,"bar",3]}};
	},
	"test should be defined": function(){
		assertFunction(Object.clone);
	},
	"test should return a deep-copied clone": function(){
		assertEquals(this.o,Object.clone(this.o));
	},
	"test should not return same object": function(){
		assertNotSame(this.o,Object.clone(this.o));
	}
});

TestCase("Singleton definition",{
	"test S singleton should be defined": function(){
		assertObject("S is an object",S);
	}
});

TestCase("Singleton constants",{
	"test constants should be defined": function(){
		assertObject(S.C);
	},
	"test success constant should be defined": function(){
		assertEquals("SUCCESS",S.C.success);
	},
	"test hasblock constant should be defined": function(){
		assertEquals("HASBLOCK",S.C.hasblock);
	},
	"test hasanswer constant should be defined": function(){
		assertEquals("HASANSWER",S.C.hasanswer);
	},
	"test redundant constant should be defined": function(){
		assertEquals("REDUNDANT",S.C.redundant);
	},
	"test notfound constant should be defined": function(){
		assertEquals("NOTFOUND",S.C.notfound);
	}/*,
    "test selecttech should be defined": function(){
		assertEquals("SELECTTECH",S.C.selecttech);
	},
	"test selectsquare should be defined": function(){
		assertEquals("SELECTSQUARE",S.C.selectsquare);
	},
    "test selectsquare should be defined": function(){
		assertEquals("SELECTCANDIDATE",S.C.selectcandidate);
	},
    "test selectingredient should be defined": function(){
		assertEquals("SELECTINGREDIENT",S.C.selectingredient);
	},
	"test selecthousetype should be defined": function(){
		assertEquals("SELECTHOUSETYPE",S.C.selecthousetype);
	}*/
});


/*********** SQUARE TESTS *****************************/

TestCase("square constructor",{
	"test square constructor should be defined": function(){
		assertFunction(S.sqr);
	},
	"test should return object": function(){
		assertObject(S.sqr());
	},
	"test should have name corresponding to args": function(){
		assertEquals("r3c5b7",S.sqr(3,5,7).id);
	},
	"test should set row property": function(){
		assertEquals("r3",S.sqr(3,5,7).r);
	},
	"test should set col property": function(){
		assertEquals("c5",S.sqr(3,5,7).c);
	},
	"test should set box property": function(){
		assertEquals("b7",S.sqr(3,5,7).b);
	}
});

TestCase("square box decider",{
	"setUp": function(){
		this.d = S.sqr.decideBox;
	},
	"test should be defined": function(){
		assertFunction(this.d);
	},
	"test should return correct box":function(){
		assertEquals(1,this.d(1,1));
		assertEquals(2,this.d(2,5));
		assertEquals(3,this.d(3,8));
		assertEquals(4,this.d(4,1));
		assertEquals(5,this.d(5,5));
		assertEquals(6,this.d(6,9));
		assertEquals(7,this.d(9,1));
		assertEquals(8,this.d(7,4));
		assertEquals(9,this.d(8,9));
	}
});

TestCase("square answerer",{
	"setUp": function(){
		this.a = S.sqr.answer;
	},
	"test should be defined": function(){
		assertFunction(this.a);
	},
	"test should set square answer cand": function(){
		var s = S.sqr(3,5,7);
		
		this.a(s,5,666);
		
		assertEquals(s.ac,5);
	},
	"test should set square answer turn": function(){
		var s = S.sqr(3,5,7);
		
		this.a(s,5,666);
		
		assertEquals(s.at,666);
	},
	"test should return SUCCESS": function(){
		var s = S.sqr(3,5,7),
		    ret = this.a(s,5,666);
		
		assertEquals(S.C.success,ret);
	},
    "test should fail if already answered": function(){
		var s = S.sqr(3,5,7), ret;
		
		this.a(s,5,666);
		ret = this.a(s,8,999);
		
		assertEquals(S.C.hasanswer,ret);
		assertEquals(5,s.ac);
		assertEquals(666,s.at);
	},
	"test should fail if candidate is blocked": function(){
		var s = S.sqr(3,5,7), ret;
		S.sqr.block(s,9,"r",666);
		
		ret = this.a(s,9,666);
		assertEquals(S.C.hasblock,ret);
		assertEquals(s.ac,undefined);
	},
	"test should succeeed even if another candidate is blocked": function(){
		var s = S.sqr(3,5,7), ret;
		S.sqr.block(s,9,"r",666);
		
		ret = this.a(s,8,666);
		assertEquals(S.C.success,ret);
		assertEquals(s.ac,8);
	},
	"test should use canBe function": function(){
		// todo - fix sinon stub thing!
	}
});

TestCase("square blocker",{
	"setUp": function(){
		this.b = S.sqr.block;
	},
	"test should be defined": function(){
		assertFunction(this.b);
	},
	"test should add block to sqr block tracker": function(){
		var s = S.sqr(3,5,7);
		this.b(s,5,"r",666);
		
		assertObject(s.blk[5]);
		assertEquals(666,s.blk[5].r);
	},
	"test should return success": function(){
		var s = S.sqr(3,5,7),
		    ret = this.b(s,5,"r",666);
	    
		assertEquals(S.C.success,ret);
	},
	"test should return success even if block for different cand exist": function(){
		var s = S.sqr(3,5,7), ret;
		this.b(s,5,"r",666);
		ret = this.b(s,6,"r",666);
	    
		assertEquals(S.C.success,ret);
	},	
	"test should return redundant for multiple blocks of different kind": function(){
		var s = S.sqr(3,5,7),
		    ret;
	    this.b(s,5,"r",666);
		ret = this.b(s,5,"m",666);
	    
		assertEquals(S.C.redundant,ret);
	},
	"test should return hasblock if same kind block already exists": function(){
		var s = S.sqr(3,5,7),
		    ret;
	    this.b(s,5,"r",666);
		ret = this.b(s,5,"r",666);
	    
		assertEquals(S.C.hasblock,ret);
	},
	"test should return hasanswer if square is answered": function(){
		var s = S.sqr(3,5,7),
		    ret;
		
        S.sqr.answer(s,1,666);
		ret = this.b(s,5,"r",666);
	    
		assertEquals(S.C.hasanswer,ret);
	}
});

TestCase("square tester",{
	"setUp": function(){
		this.c = S.sqr.canBe;
	},
	"test should be defined": function(){
		assertFunction(this.c);
	},
	"test should return success": function(){
		var s = S.sqr(3,5,7);

		assertEquals(S.C.success,this.c(s,1));
		assertEquals(S.C.success,this.c(s,5));
		assertEquals(S.C.success,this.c(s,9));
	},
	"test should return answered for already answered squares":function(){
		var s = S.sqr(3,5,7);
		S.sqr.answer(s,5,666);
		
		assertEquals(S.C.hasanswer,this.c(s,1));
		assertEquals(S.C.hasanswer,this.c(s,5));
	},
	"test should return success for squares with other cands blocked": function(){
		var s = S.sqr(3,5,7);
		S.sqr.block(s,5,"m",666);
		
		assertEquals(S.C.success,this.c(s,4));
	},
	"test should return hasblock for squares with this cand blocked": function(){
		var s = S.sqr(3,5,7);
		S.sqr.block(s,5,"m",666);
		
		assertEquals(S.C.hasblock,this.c(s,5));
	}
});

TestCase("square remaining calculator",{
	"setUp": function(){
		this.r = S.sqr.remaining;
	},
	"test should be defined": function(){
		assertFunction(this.r);
	},
	"test should return array of all cands for unblocked square": function(){
		var s = S.sqr(3,5,7);
		assertEquals([1,2,3,4,5,6,7,8,9],this.r(s));
	},
	"test should return empty array for answered square": function(){
		var s = S.sqr(3,5,7);
		S.sqr.answer(s,1,666);
		assertEquals([],this.r(s));
	},
	"test should exclude blocked candidates in returnlist": function(){
		var s = S.sqr(3,5,7);
		S.sqr.block(s,2,"m",666);
		S.sqr.block(s,5,"m",666);
		S.sqr.block(s,8,"m",666);
		assertEquals([9,7,6,4,3,1],this.r(s));
	},
	"test should use canBe for sqr with blocks": function(){
		// todo - fix with sinon
	},
	"test should not use canBe for sqr with no blocks": function(){
		// todo - fix with sinon
	}
});

TestCase("square cssClass",{
	setUp: function(){
		this.c = S.sqr.cssClass;
		this.s = S.sqr(3,5,7);
	},
	"test should be defined": function(){
		assertFunction(this.c);
	},
	"test should return full 'canbe' string with all candidates for unblocked square, along with houses": function(){
		assertEquals("r3 c5 b7 canbe1 canbe2 canbe3 canbe4 canbe5 canbe6 canbe7 canbe8 canbe9",this.c(this.s));
	},
	"test should return lone 'is' with cand if answered": function(){
		S.sqr.answer(this.s,6,666);
		assertEquals("r3 c5 b7 is6",this.c(this.s));
	},
	"test should ignore blocks if has answer": function(){
		S.sqr.block(this.s,8,"r",666);
		S.sqr.answer(this.s,6,666);
		assertEquals("r3 c5 b7 is6",this.c(this.s));
	},
	"test sould return 'start' with cand if had cand from the beginning": function(){
		S.sqr.answer(this.s,6,-1);
		assertEquals("r3 c5 b7 start6",this.c(this.s));
	},
	"test should exclude blocked candidates from class string": function(){
		S.sqr.block(this.s,2,"m",666);
		S.sqr.block(this.s,5,"m",666);
		S.sqr.block(this.s,8,"m",666);
		assertEquals("r3 c5 b7 canbe9 canbe7 canbe6 canbe4 canbe3 canbe1",this.c(this.s));
	},
	"test should use remaining func to build string for sqr with blocks": function(){
		// todo - fix with sinon
	},
	"test should not use remaining func for sqr without blocks": function(){
		// todo - fix with sinon
	}
});

TestCase("square unblocker",{
	setUp: function(){
		this.u = S.sqr.unblock;
	},
	"test should be defined": function(){
		assertFunction(this.u);
	},
	"test should return notfound when unblocking non-blocked square":function(){
		var s = S.sqr(3,5,7);
		assertEquals(S.C.notfound,this.u(s,4,"m"));
	},
	"test should return notfound when unblocking wrong cand":function(){
		var s = S.sqr(3,5,7);
		S.sqr.block(s,3,"m",666);
		assertEquals(S.C.notfound,this.u(s,4,"m"));
	},
	"test should return notfound when unblocking wrong kind":function(){
		var s = S.sqr(3,5,7);
		S.sqr.block(s,4,"r",666);
		assertEquals(S.C.notfound,this.u(s,4,"m"));
	},
	"test should return success when unblocking blocked cand & kind": function(){
		var s = S.sqr(3,5,7);
		S.sqr.block(s,4,"m",666);
		assertEquals(S.C.success,this.u(s,4,"m"));
	},
	"test should remove entire block obj when unblocking last obj": function(){
		var s = S.sqr(3,5,7);
		S.sqr.block(s,4,"m",666);
		this.u(s,4,"m");
		assertUndefined(s.blk);
	},
	"test should remove entire cand block when unblocking last can block": function(){
		var s = S.sqr(3,5,7);
		S.sqr.block(s,4,"m",666);
		S.sqr.block(s,3,"m",666);
		this.u(s,4,"m");
		assertUndefined(s.blk[4]);
	},
	"test should not remove blocks of other kind for same cand": function(){
		var s = S.sqr(3,5,7);
		S.sqr.block(s,4,"r",666);
		S.sqr.block(s,4,"m",666);
		this.u(s,4,"m");
		assertEquals(666,s.blk[4].r);
	}
});

TestCase("Square unanswer function",{
	setUp: function(){
		this.u = S.sqr.unanswer;
		this.s = S.sqr(3,5,7);
	},
	"test should be defined": function(){
		assertFunction(this.u);
	},
	"test should return NOTFOUND for unanswered squares":function(){
		assertEquals(S.C.notfound,this.u(this.s));
	},
	"test should return SUCCESS for answered square":function(){
		var ret;
		S.sqr.answer(this.s,5,666);
		ret = this.u(this.s);
		assertEquals(S.C.success,ret);
	},
	"test should remove answered cand": function(){
		S.sqr.answer(this.s,5,666);
		this.u(this.s);
		assertUndefined(this.s.ac);
	},
	"test should remove answered turn": function(){
		S.sqr.answer(this.s,5,666);
		this.u(this.s);
		assertUndefined(this.s.at);
	}
});

TestCase("square revert function", {
	setUp: function(){
		this.r = S.sqr.revert;
		this.s = S.sqr(3,5,7);
		S.sqr.block(this.s,5,"m",666);
		S.sqr.block(this.s,5,"r",667);
		S.sqr.block(this.s,6,"c",668);
		S.sqr.answer(this.s,7,777);
	},
	"test should be defined": function(){
		assertFunction(this.r);
	},
	"test should not remove anything prior to target turn":function(){
		this.r(this.s,777);
		assertEquals(777,this.s.at);
		assertEquals(668,this.s.blk[6].c);
		assertEquals(667,this.s.blk[5].r);
		assertEquals(666,this.s.blk[5].m);
	},
	"test should remove answer if after target turn": function(){
		this.r(this.s,776);
		assertUndefined(this.s.ac);
		assertUndefined(this.s.at);
	},
	"test should remove block if after target turn": function(){
		this.r(this.s,667);
	    assertFalse(!!(this.s.blk && this.s.blk[6] && this.s.blk[6].c === 668));
	},
	"test should remove cand block object if was last cand": function(){
		this.r(this.s,667);
	    assertUndefined(this.s.blk[6]);
	},
	"test should remove entire block object if no more blocks": function(){
		this.r(this.s,100);
		assertUndefined(this.s.blk);
	}
});

TestCase("square friends function",{
	setUp: function(){
		this.f = S.sqr.friends;
	},
	"test should be defined": function(){
		assertFunction(this.f);
	},
	"test should return an array of neighbours": function(){
		assertEquals(["r1c2b1","r1c3b1","r1c4b2","r1c5b2","r1c6b2","r1c7b3","r1c8b3","r1c9b3","r2c1b1","r3c1b1","r4c1b4","r5c1b4","r6c1b4","r7c1b7","r8c1b7","r9c1b7","r2c2b1","r2c3b1","r3c2b1","r3c3b1"],this.f(S.sqr(1,1,1)));
	}
});

TestCase("square possibleCands function",{
	"test should be defined": function(){
		assertFunction(S.sqr.possibleCands);
	},
	"test should return [] for answered squares": function(){
		var s = S.sqr(3,4,5);
		S.sqr.answer(s,5,666);
		assertEquals([],S.sqr.possibleCands(s));
	},
	"test should return full list of cands for unblocked squares": function(){
		assertEquals([1,2,3,4,5,6,7,8,9],S.sqr.possibleCands(S.sqr(3,4,5)));
	},
	"test should exclude blocked cands": function(){
		var s = S.sqr(3,4,5);
		S.sqr.block(s,5,"m",666);
		assertEquals([1,2,3,4,6,7,8,9],S.sqr.possibleCands(s));
	}
});

/**************** SELECTION TESTS ***************************/

TestCase("selection constructor",{
	"test should be defined":function(){
		assertFunction(S.sel);
	},
	"test should return an object": function(){
		assertObject(S.sel());
	},
	"test should have a sqrs property with empty array": function(){
		assertEquals([],S.sel().sqrs);
	},
	"test should have a pos property obj": function(){
		assertObject(S.sel().pos);
	},
	"test should have an empty array for each cand on the pos obj": function(){
		var sel = S.sel();
		for(var c=1;c<=9;c++){
			assertEquals([],sel.pos[c]);
		}
	},
	"test should have an empty array sees prop": function(){
		assertEquals([],S.sel().sees);
	},
	"test should have empty array cmmn prop": function(){
		assertEquals([],S.sel().commonCands);
	},
	"test should have empty array rows prop": function(){
		assertEquals([],S.sel().r);
	},
	"test should have empty array cols prop": function(){
		assertEquals([],S.sel().c);
	},
	"test should have empty array boxes prop": function(){
		assertEquals([],S.sel().b);
	},
	"test should add squares given in array arg": function(){
		var sud = S.sud(),
		    sqrs = ["r1c1b1","r1c2b1"],
			sel = S.sel(sud,sqrs);
		assertEquals(sqrs,sel.sqrs);
		// TODO - use sinon to check that S.sel.add is used in correct way
	},
	"test should have an empty contains array": function(){
		assertEquals([],S.sel().includedCands);
	}
});

TestCase("selection add square function",{
	"test should be defined": function(){
		assertFunction(S.sel.add);
	},
	"test should add given square to sqrs prop":function(){
		var sel = S.sel(),
		    sud = S.sud(),
		    s1 = sud.sqrs.r1c1b1,
			s2 = sud.sqrs.r1c2b1;
		S.sel.add(sud,sel,s1.id);
		assertEquals([s1.id],sel.sqrs);
		S.sel.add(sud,sel,s2.id);
		assertEquals([s1.id,s2.id],sel.sqrs);
	},
	"test should add square to relevant cand pos arrs":function(){
		var sel = S.sel(),
		    sud = S.sud(),
		    s1 = sud.sqrs.r1c1b1,
			s2 = sud.sqrs.r1c2b1;
	    S.sqr.block(s1,5,"m",666);
		S.sel.add(sud,sel,s1.id);
		S.sel.add(sud,sel,s2.id);
		assertEquals([s1.id,s2.id],sel.pos[1]);
		assertEquals([s2.id],sel.pos[5]);
	},
	"test should add first squares cands to commonCands":function(){
		var sel = S.sel(),
		    sud = S.sud(),
		    s1 = sud.sqrs.r1c1b1;
	    S.sqr.block(s1,5,"m",666);
		S.sel.add(sud,sel,s1.id);
		assertEquals([1,2,3,4,6,7,8,9],sel.commonCands);
	},
    "test should add first squares cands to includedCands":function(){
		var sel = S.sel(),
		    sud = S.sud(),
		    s1 = sud.sqrs.r1c1b1;
	    S.sqr.block(s1,5,"m",666);
		S.sel.add(sud,sel,s1.id);
		assertEquals([1,2,3,4,6,7,8,9],sel.includedCands);
	},
	"test should add squares row & col to rows & cols & boxes prop": function(){
		var sel = S.sel(),
		    sud = S.sud(),
		    s1 = sud.sqrs.r1c1b1,
			s2 = sud.sqrs.r1c2b1;
		S.sel.add(sud,sel,s1.id);
		S.sel.add(sud,sel,s2.id);
		assertEquals(["r1"],sel.r);
		assertEquals(["c1","c2"],sel.c);
		assertEquals(["b1"],sel.b);	
	},
	"test should reduce commonCands when adding 2nd square": function(){
		var sel = S.sel(),
		    sud = S.sud(),
		    s1 = sud.sqrs.r1c1b1,
			s2 = sud.sqrs.r1c2b1;
	    S.sqr.block(s1,5,"m",666);
	    S.sqr.block(s2,6,"m",666);
		S.sel.add(sud,sel,s1.id);
		S.sel.add(sud,sel,s2.id);
		assertEquals([1,2,3,4,7,8,9],sel.commonCands);
	},
    "test should add to includedCands when adding 2nd square": function(){
		var sel = S.sel(),
		    sud = S.sud(),
		    s1 = sud.sqrs.r1c1b1,
			s2 = sud.sqrs.r1c2b1;
	    S.sqr.block(s1,5,"m",666);
	    S.sqr.block(s1,6,"m",666);
		S.sqr.block(s1,7,"m",666);
		S.sqr.block(s2,7,"m",666);
		S.sel.add(sud,sel,s1.id);
		S.sel.add(sud,sel,s2.id);
		assertEquals([1,2,3,4,5,6,8,9],sel.includedCands);
	}
});

TestCase("selection remove square function",{
	"test should be defined": function(){
		assertFunction(S.sel.remove);
	},
	"test should fail if square isn't in the selection": function(){
		var sel = S.sel(),
		    sud = S.sud(),
			sqr = sud.sqrs.r1c1b1;
	    assertEquals(S.C.notfound,S.sel.remove(sud,sel,sqr.id));
	},
	"test should succeed if square is in selection": function(){
		var sel = S.sel(),
		    sud = S.sud(),
			sqr = sud.sqrs.r1c1b1;
		S.sel.add(sud,sel,sqr.id);
	    assertEquals(S.C.success,S.sel.remove(sud,sel,sqr.id));		
	},
	"test should remove square from selection": function(){
		var sel = S.sel(),
		    sud = S.sud(),
			s1 = sud.sqrs.r1c1b1,
			s2 = sud.sqrs.r1c2b1;
		S.sel.add(sud,sel,s1.id);
		S.sel.add(sud,sel,s2.id);
		S.sel.remove(sud,sel,s1.id);
	    assertEquals([s2.id],sel.sqrs);		
	},
	"test should update cand pos after removal": function(){
		var sel = S.sel(),
		    sud = S.sud(),
			s1 = sud.sqrs.r1c1b1,
			s2 = sud.sqrs.r1c2b1;
		S.sel.add(sud,sel,s1.id);
		S.sel.add(sud,sel,s2.id);
		S.sel.remove(sud,sel,s1.id);
	    assertEquals([s2.id],sel.pos[1]);		
	},
	"test should update common cands after removal": function(){
		var sel = S.sel(),
		    sud = S.sud(),
			s1 = sud.sqrs.r1c1b1,
			s2 = sud.sqrs.r1c2b1;
		S.sqr.block(s1,5,"m",666);
		S.sel.add(sud,sel,s1.id);
		S.sel.add(sud,sel,s2.id);
		S.sel.remove(sud,sel,s1.id);
	    assertEquals([1,2,3,4,5,6,7,8,9],sel.commonCands);
	},
    "test should update included cands after removal": function(){
		var sel = S.sel(),
		    sud = S.sud(),
			s1 = sud.sqrs.r1c1b1,
			s2 = sud.sqrs.r1c2b1;
		S.sqr.block(s1,5,"m",666);
		S.sel.add(sud,sel,s1.id);
		S.sel.add(sud,sel,s2.id);
		S.sel.remove(sud,sel,s2.id);
	    assertEquals([1,2,3,4,6,7,8,9],sel.includedCands);
	},
	"test should update rows and cols and boxes after removal": function(){
		var sel = S.sel(),
		    sud = S.sud();
		S.sel.add(sud,sel,"r1c1b1");
		S.sel.add(sud,sel,"r2c5b2");
		S.sel.remove(sud,sel,"r1c1b1");
	    assertEquals(["c5"],sel.c);
		assertEquals(["r2"],sel.r);
		assertEquals(["b2"],sel.b);	
	}
});


/********************** HOUSE TESTS **************************/

TestCase("house constructor",{
	"setUp": function(){
		this.h = S.house;
	},
	"test should be defined": function(){
		assertFunction(this.h);
	},
	"test should return object": function(){
		assertObject(this.h("r1"));
	},
	"test should have id prop": function(){
		assertEquals("r1",S.house("r1").id);
	},
	"test should have pos object": function(){
		assertObject(this.h("r1").pos);
	},
	"test pos propobj should contain arr of all house squares for each cand": function(){
		var h = S.house("r1");
		for(var c=1;c<=9;c++){
			assertEquals(S.house.sqrs.r1,h.pos[c]);
		}
	},
	"test pos propobj cand pos arrs should not be same as constants arrs": function(){
		var h = S.house("r1");
		for(var c=1;c<=9;c++){
			assertNotSame(S.house.sqrs.r1,h.pos[c]);
		}
	},
	"test should have remanining array": function(){
		var h = S.house("r1");
		assertEquals([1,2,3,4,5,6,7,8,9],h.rmn);
	}
});

TestCase("house squares",{
	"setUp": function(){
		this.sqrs = S.house.sqrs;
	},
	"test should be defined": function(){
		assertObject(this.sqrs);
	},
	"test r1 should be defined": function(){
		assertEquals(["r1c1b1","r1c2b1","r1c3b1","r1c4b2","r1c5b2","r1c6b2","r1c7b3","r1c8b3","r1c9b3"],this.sqrs.r1);
	},
    "test r2 should be defined": function(){
		assertEquals(["r2c1b1","r2c2b1","r2c3b1","r2c4b2","r2c5b2","r2c6b2","r2c7b3","r2c8b3","r2c9b3"],this.sqrs.r2);
	},
    "test r3 should be defined": function(){
		assertEquals(["r3c1b1","r3c2b1","r3c3b1","r3c4b2","r3c5b2","r3c6b2","r3c7b3","r3c8b3","r3c9b3"],this.sqrs.r3);
	},
    "test r4 should be defined": function(){
		assertEquals(["r4c1b4","r4c2b4","r4c3b4","r4c4b5","r4c5b5","r4c6b5","r4c7b6","r4c8b6","r4c9b6"],this.sqrs.r4);
	},
    "test r5 should be defined": function(){
		assertEquals(["r5c1b4","r5c2b4","r5c3b4","r5c4b5","r5c5b5","r5c6b5","r5c7b6","r5c8b6","r5c9b6"],this.sqrs.r5);
	},
    "test r6 should be defined": function(){
		assertEquals(["r6c1b4","r6c2b4","r6c3b4","r6c4b5","r6c5b5","r6c6b5","r6c7b6","r6c8b6","r6c9b6"],this.sqrs.r6);
	},
    "test r7 should be defined": function(){
		assertEquals(["r7c1b7","r7c2b7","r7c3b7","r7c4b8","r7c5b8","r7c6b8","r7c7b9","r7c8b9","r7c9b9"],this.sqrs.r7);
	},
    "test r8 should be defined": function(){
		assertEquals(["r8c1b7","r8c2b7","r8c3b7","r8c4b8","r8c5b8","r8c6b8","r8c7b9","r8c8b9","r8c9b9"],this.sqrs.r8);
	},
    "test r9 should be defined": function(){
		assertEquals(["r9c1b7","r9c2b7","r9c3b7","r9c4b8","r9c5b8","r9c6b8","r9c7b9","r9c8b9","r9c9b9"],this.sqrs.r9);
	},
    "test c1 should be defined": function(){
		assertEquals(["r1c1b1","r2c1b1","r3c1b1","r4c1b4","r5c1b4","r6c1b4","r7c1b7","r8c1b7","r9c1b7"],this.sqrs.c1);
	},
    "test c2 should be defined": function(){
		assertEquals(["r1c2b1","r2c2b1","r3c2b1","r4c2b4","r5c2b4","r6c2b4","r7c2b7","r8c2b7","r9c2b7"],this.sqrs.c2);
	},
    "test c3 should be defined": function(){
		assertEquals(["r1c3b1","r2c3b1","r3c3b1","r4c3b4","r5c3b4","r6c3b4","r7c3b7","r8c3b7","r9c3b7"],this.sqrs.c3);
	},
    "test c4 should be defined": function(){
		assertEquals(["r1c4b2","r2c4b2","r3c4b2","r4c4b5","r5c4b5","r6c4b5","r7c4b8","r8c4b8","r9c4b8"],this.sqrs.c4);
	},
    "test c5 should be defined": function(){
		assertEquals(["r1c5b2","r2c5b2","r3c5b2","r4c5b5","r5c5b5","r6c5b5","r7c5b8","r8c5b8","r9c5b8"],this.sqrs.c5);
	},
    "test c6 should be defined": function(){
		assertEquals(["r1c6b2","r2c6b2","r3c6b2","r4c6b5","r5c6b5","r6c6b5","r7c6b8","r8c6b8","r9c6b8"],this.sqrs.c6);
	},
    "test c7 should be defined": function(){
		assertEquals(["r1c7b3","r2c7b3","r3c7b3","r4c7b6","r5c7b6","r6c7b6","r7c7b9","r8c7b9","r9c7b9"],this.sqrs.c7);
	},
    "test c8 should be defined": function(){
		assertEquals(["r1c8b3","r2c8b3","r3c8b3","r4c8b6","r5c8b6","r6c8b6","r7c8b9","r8c8b9","r9c8b9"],this.sqrs.c8);
	},
    "test c9 should be defined": function(){
		assertEquals(["r1c9b3","r2c9b3","r3c9b3","r4c9b6","r5c9b6","r6c9b6","r7c9b9","r8c9b9","r9c9b9"],this.sqrs.c9);
	},
	"test b1 should be defined": function(){
		assertEquals(["r1c1b1","r1c2b1","r1c3b1","r2c1b1","r2c2b1","r2c3b1","r3c1b1","r3c2b1","r3c3b1"],this.sqrs.b1);
	},
	"test b2 should be defined": function(){
		assertEquals(["r1c4b2","r1c5b2","r1c6b2","r2c4b2","r2c5b2","r2c6b2","r3c4b2","r3c5b2","r3c6b2"],this.sqrs.b2);
	},
	"test b3 should be defined": function(){
		assertEquals(["r1c7b3","r1c8b3","r1c9b3","r2c7b3","r2c8b3","r2c9b3","r3c7b3","r3c8b3","r3c9b3"],this.sqrs.b3);
	},
	"test b4 should be defined": function(){
		assertEquals(["r4c1b4","r4c2b4","r4c3b4","r5c1b4","r5c2b4","r5c3b4","r6c1b4","r6c2b4","r6c3b4"],this.sqrs.b4);
	},
	"test b5 should be defined": function(){
		assertEquals(["r4c4b5","r4c5b5","r4c6b5","r5c4b5","r5c5b5","r5c6b5","r6c4b5","r6c5b5","r6c6b5"],this.sqrs.b5);
	},
	"test b6 should be defined": function(){
		assertEquals(["r4c7b6","r4c8b6","r4c9b6","r5c7b6","r5c8b6","r5c9b6","r6c7b6","r6c8b6","r6c9b6"],this.sqrs.b6);
	},
	"test b7 should be defined": function(){
		assertEquals(["r7c1b7","r7c2b7","r7c3b7","r8c1b7","r8c2b7","r8c3b7","r9c1b7","r9c2b7","r9c3b7"],this.sqrs.b7);
	},
	"test b8 should be defined": function(){
		assertEquals(["r7c4b8","r7c5b8","r7c6b8","r8c4b8","r8c5b8","r8c6b8","r9c4b8","r9c5b8","r9c6b8"],this.sqrs.b8);
	},
	"test b9 should be defined": function(){
		assertEquals(["r7c7b9","r7c8b9","r7c9b9","r8c7b9","r8c8b9","r8c9b9","r9c7b9","r9c8b9","r9c9b9"],this.sqrs.b9);
	}
});

TestCase("House calc function",{
	"test should be defined": function(){
		assertFunction(S.house.calc);
	},
	"test should correctly set remaining list": function(){
		var sud = S.sud(),
		    s1 = sud.sqrs.r1c1b1;
	    S.sqr.answer(s1,5,666);
		S.house.calc(sud,"r1");
		assertEquals([1,2,3,4,6,7,8,9],sud.houses.r1.rmn);
	},
	"test should rebuild poslist": function(){
		var sud = S.sud();
		S.house.calc(sud,"r1");
		assertEquals(S.house.sqrs.r1,sud.houses.r1.pos[5]);		
	},
	"test should set pos list to [] if has that cand answered": function(){
		var sud = S.sud(),
		    s1 = sud.sqrs.r1c1b1;
	    S.sqr.answer(s1,5,666);
		S.house.calc(sud,"r1");
		assertEquals([],sud.houses.r1.pos[5]);		
	},
	"test should exclude blocked squares from poslist": function(){
		var sud = S.sud(),
		    s1 = sud.sqrs.r1c1b1;
	    S.sqr.block(s1,5,"m",666);
		S.house.calc(sud,"r1");
		assertEquals(["r1c2b1","r1c3b1","r1c4b2","r1c5b2","r1c6b2","r1c7b3","r1c8b3","r1c9b3"],sud.houses.r1.pos[5]);		
	},
	"test should call answer for cands in given sudoku if any": function(){
		//var sud = S.sud("000000001 000001000 000000000 100000000 000000000 000000000 010000000 000000000 000000000")
		var sud = S.sud("000000001000001000000000000100000000000000000000000000010000000000000000000000000");
		// TODO - check with sinon!
		assertEquals(1,sud.sqrs.r1c9b3.ac);
	}
});

/********************* SUDOKU TESTS **************************/

TestCase("Sudoku data structure constructor",{
	"test function should be defined": function(){
		assertFunction("S has data constructor",S.sud);
	},
	"test should return an object": function(){
		assertObject(S.sud());
	},
	"test should have sqrs obj prop": function(){
		assertObject(S.sud().sqrs);
	},
	"test should contain 81 squares": function(){
		assertEquals(81,Object.countProperties(S.sud().sqrs));
	},
	"test should contain 27 houses": function(){
		assertEquals(27,Object.countProperties(S.sud().houses));
	}
});

TestCase("Sudoku square list should be set",{
	"test sudoku square list should exist": function(){
		assertArray(S.sud.sqrs);
	},
	"test should be 81 long": function(){
		assertEquals(81,S.sud.sqrs.length);
	}
});

TestCase("Sudoku square answerer",{
	"test function should be defined": function(){
		assertFunction(S.sud.answer);
	},
	"test should return hasblock if square is blocked": function(){
		var sud = S.sud(),
		    sqr = sud.sqrs.r1c1b1;
		S.sqr.block(sqr,5,"m",666);
		assertEquals(S.C.hasblock,S.sud.answer(sud,sqr.id,5));
	},
	"test should return hasblock if square is already answered": function(){
		var sud = S.sud(),
		    sqr = sud.sqrs.r1c1b1;
		S.sqr.answer(sqr,5,666);
		assertEquals(S.C.hasanswer,S.sud.answer(sud,sqr.id,5));
	},
	"test should return success if square is answered ok": function(){
		var sud = S.sud(),
		    sqr = sud.sqrs.r1c1b1;
		assertEquals(S.C.success,S.sud.answer(sud,sqr.id,5));
	},
	"test should set square to cand answer": function(){
		var sud = S.sud(),
		    sqr = sud.sqrs.r1c1b1;
		S.sud.answer(sud,sqr.id,5);
		assertEquals(5,sqr.ac);
	},
	"test should set square answerturn to sud step": function(){
		var sud = S.sud(),
		    sqr = sud.sqrs.r1c1b1;
		sud.turn = 666;
		S.sud.answer(sud,sqr.id,5);
		assertEquals(666,sqr.at);
	},
	"test should not block cand in friends if cascade is false": function(){
		var sud = S.sud(),
		    s1 = sud.sqrs.r1c1b1,
			s2 = sud.sqrs.r1c2b1;
		sud.cascade = false;
		S.sud.answer(sud,s1.id,5);
		assertEquals(S.C.success,S.sqr.canBe(s2,5));
	},
	"test should block cand in friends if cascade in sud is true": function(){
		var sud = S.sud(),
		    s1 = sud.sqrs.r1c1b1,
			s2 = sud.sqrs.r1c9b3,
			s3 = sud.sqrs.r3c3b1,
			s4 = sud.sqrs.r9c1b7;
		sud.cascade = true;
		S.sud.answer(sud,s1.id,5);
		assertEquals(S.C.hasblock,S.sqr.canBe(s2,5));
		assertEquals(S.C.hasblock,S.sqr.canBe(s3,5));
		assertEquals(S.C.hasblock,S.sqr.canBe(s4,5));
	},
	"test should not block cand if answering fails even if cascade is true": function(){
		var sud = S.sud(),
		    s1 = sud.sqrs.r1c1b1,
			s2 = sud.sqrs.r1c9b3,
			s3 = sud.sqrs.r3c3b1,
			s4 = sud.sqrs.r9c1b7;
		sud.cascade = true;
		S.sqr.block(s1,5,"m",666);
		S.sud.answer(sud,s1.id,5);
		assertEquals(S.C.success,S.sqr.canBe(s2,5));
		assertEquals(S.C.success,S.sqr.canBe(s3,5));
		assertEquals(S.C.success,S.sqr.canBe(s4,5));
	},
	"test should cause cascaded blocks to remove those sqrs from house pos cand lists": function(){
        var sud = S.sud(),
		    s1 = sud.sqrs.r1c1b1;
		sud.cascade = true;
		S.sud.answer(sud,s1.id,5);
		assertEquals(6,sud.houses.r2.pos[5].length);
		assertEquals(8,sud.houses.r4.pos[5].length);
	},
	"test should use S.sud.block": function(){
		// TODO - fix with sinon
	},
	"test should remove cand from house remaining lists": function(){
		var sud = S.sud(),
		    s1 = sud.sqrs.r1c1b1;
		sud.turn = 666;
		S.sud.answer(sud,s1.id,5);
		assertEquals([1,2,3,4,6,7,8,9],sud.houses.r1.rmn);
		assertEquals([1,2,3,4,6,7,8,9],sud.houses.c1.rmn);
		assertEquals([1,2,3,4,6,7,8,9],sud.houses.b1.rmn);
	},
	"test should set pos list in houses for answered cands to []": function(){
		// TODO - think, is this really what we want?
		var sud = S.sud(),
		    s1 = sud.sqrs.r1c1b1;
		sud.turn = 666;
		S.sud.answer(sud,s1.id,5);
		assertEquals([],sud.houses.r1.pos[5]);
		assertEquals([],sud.houses.c1.pos[5]);
		assertEquals([],sud.houses.b1.pos[5]);
	}
});

TestCase("Sudoku square unanswerer",{
	"test assert function should be defined": function(){
		assertFunction(S.sud.unanswer);
	},
	"test should return notfound for sqr without answer": function(){
		var sud = S.sud(),
		    s1 = sud.sqrs.r1c1b1;
		assertEquals(S.C.notfound,S.sud.unanswer(sud,s1.id));
	},
	"test should return success for sqr with answer": function(){
		var sud = S.sud(),
		    s1 = sud.sqrs.r1c1b1;
		S.sud.answer(sud,s1.id,5);
		assertEquals(S.C.success,S.sud.unanswer(sud,s1.id));
	},
	"test should not remove block in friends": function(){
		var sud = S.sud(),
		    s1 = sud.sqrs.r1c1b1,
			s2 = sud.sqrs.r1c2b1;
		sud.cascade = false;
		S.sqr.block(s2,5,"r",666);
		S.sqr.answer(s1,5,666);
		S.sud.unanswer(sud,s1.id,5);
		assertEquals(S.C.hasblock,S.sqr.canBe(s2,5));
	},
	"test should remove block in friends if cascade in sud is true": function(){
		var sud = S.sud(),
		    s1 = sud.sqrs.r1c1b1,
			s2 = sud.sqrs.r1c9b3,
			s3 = sud.sqrs.r3c3b1,
			s4 = sud.sqrs.r9c1b7;
		sud.cascade = true;
		sud.turn = 666;
		S.sud.answer(sud,s1.id,5);
		S.sud.unanswer(sud,s1.id);
		assertEquals(S.C.success,S.sqr.canBe(s2,5));
		assertEquals(S.C.success,S.sqr.canBe(s3,5));
		assertEquals(S.C.success,S.sqr.canBe(s4,5));
	},
	"test should only remove relevant block in friends": function(){
		var sud = S.sud(),
		    s1 = sud.sqrs.r1c1b1,
			s2 = sud.sqrs.r1c9b3,
			s3 = sud.sqrs.r3c3b1,
			s4 = sud.sqrs.r9c1b7;
		sud.cascade = true;
		sud.turn = 666;
		S.sqr.block(s2,5,"m",666);
		S.sud.answer(sud,s1.id,5);
		S.sud.unanswer(sud,s1.id);
		assertEquals(S.C.hasblock,S.sqr.canBe(s2,5));
	}
});

TestCase("Sudoku blocker",{
	"test should be defined":function(){
		assertFunction(S.sud.block);
	},
	"test should call sqr block fun with correct args": function(){
		assertTrue(true); // TODO - fix with sinon!
	},
	"test should not remove square from housepos if block isn't first": function(){
		var sud = S.sud(),
		    s1 = sud.sqrs.r1c1b1;
		sud.turn = 666;
		S.sqr.block(s1,5,"m",665);
		S.sud.block(sud,s1.id,5,"r");
		assertEquals(S.house.sqrs.r1,sud.houses.r1.pos[5]);
	},
	"test should remove square from housepos if block is first": function(){
		var sud = S.sud(),
		    s1 = sud.sqrs.r1c1b1;
		sud.turn = 666;
		S.sud.block(sud,s1.id,5,"r");
		assertTrue(sud.houses.r1.pos[5].indexOf(s1.id)===-1);
		assertEquals(8,sud.houses.r1.pos[5].length);
	}
});

/******************************** Tech tests ***********************************/

var ensureIngredientsInDescription = function(desc,ingr){
	for(var i in ingr){
		if (desc.match("{"+i+"}")===null){
			return false;
		}
	}
	return true;
};

TestCase("Tech object",{
	"test should be defined": function(){
		assertObject(S.techs);
	}
});

TestCase("Tech ingredients checker",{
	"test should be defined": function(){
		assertFunction(S.techs.check);
	},
	"test should return undefined if no problems": function(){
		var sud = S.sud(), ingr = {}, recipe = {};
		assertUndefined(S.techs.check(sud,ingr,recipe));
	},
	"test should return error if some ingredients are missing": function(){
		var sud = S.sud(), ingr = {foo:"bar"}, recipe = {foo:{type:"moo"},woot:{type:"wee"},baz:{type:"wuu"}},
		    exp = {
				msg: "Some ingredients are missing!",
				ingr: ["woot","baz"]
			};
		assertEquals(exp,S.techs.check(sud, ingr, recipe));
	},
	"test should return error if collection has too few members": function(){
		var sud = S.sud(),
		    recipe = {foo:{type:"square",min:3},bar:{type:"square",min:3}},
			ingr = {},
			exp = {
				msg: "You have selected too few!",
				ingr: ["foo"]
			};
		ingr.foo = S.sel(sud,["r1c1b1","r1c2b1"]);
		ingr.bar = S.sel(sud,["r1c1b1","r1c2b1","r1c3b1"]);
		assertEquals(exp,S.techs.check(sud, ingr, recipe));
	},
	"test should return error if collection has too many members": function(){
		var sud = S.sud(),
		    recipe = {foo:{type:"square",max:2}},
			ingr = {},
			exp = {
				msg: "You have selected too many!",
				ingr: ["foo"]
			};
		ingr.foo = S.sel(sud,["r1c1b1","r1c2b1","r1c3b1"]);
		assertEquals(exp,S.techs.check(sud, ingr, recipe));
	},
	"test should return error if oneboxwith isn't fulfilled": function(){
		var sud = S.sud(),
		    recipe = S.techs.lockedCandidates.recipe,
			ingr = {
				squares: S.sel(sud,["r1c1b1","r1c2b1"]),
				cand: 5,
				candsin: "r",
				deletefrom: "c"
			},
			exp = {
				msg: "You must select row & box or column & box!",
				ingr: ["candsin","deletefrom"]
			};
		assertEquals(exp,S.techs.check(sud,ingr,recipe));
		ingr.candsin = "b";
		ingr.deletefrom = "b";
		assertEquals(exp,S.techs.check(sud,ingr,recipe));
	},
	"test should not return error for correct oneboxwith": function(){
		var sud = S.sud(),
		    recipe = S.techs.lockedCandidates.recipe,
			ingr = {
				squares: S.sel(sud,["r1c1b1","r1c2b1"]),
				cand: 5,
				candsin: "r",
				deletefrom: "b"
			};
		assertUndefined(S.techs.check(sud,ingr,recipe));
		ingr.candsin = "b";
		ingr.deletefrom = "c";
		assertUndefined(S.techs.check(sud,ingr,recipe));
	}
});

TestCase("Tech performer",{
	"test should be defined": function(){
		assertFunction(S.techs.perform);
	},
	"test should perform answers in result obj": function(){
		var sud = S.sud(), res = {answers:[["r1c1b1",1]]};
		S.techs.perform(sud,res);
		assertEquals(1,sud.sqrs.r1c1b1.ac);
		assertEquals(S.C.hasblock,S.sqr.canBe(sud.sqrs.r1c2b1,1));
	},
	"test should perform blocks in result obj": function(){
		var sud = S.sud(), res = {blocks:[["r1c1b1",1]]};
		S.techs.perform(sud,res);
		assertEquals(S.C.hasblock,S.sqr.canBe(sud.sqrs.r1c1b1,1));
	}
});

TestCase("Tech ingredient describer",{
	"test should be defined": function(){
		assertFunction(S.techs.describeIngredient);
	},
	"test should return 'square' for a non-picked singleSquare type ingredient": function(){
		var name = "square", recipe = S.techs.nakedSingle.recipe, picked = {};
		assertEquals("SQUARE",S.techs.describeIngredient(name,recipe,picked));
	},
	"test should return squarename for picked singlesquare type ingredient": function(){
		var name = "square",
		    recipe = S.techs.nakedSingle.recipe,
			picked = {square:"r1c1b1"};
		assertEquals("r1c1b1",S.techs.describeIngredient(name,recipe,picked));
	},
	"test should return 'candidate' for a non-picked singleCandidate type ingredient": function(){
		var name = "cand",
		    recipe = S.techs.hiddenSingle.recipe;
		assertEquals("CANDIDATE",S.techs.describeIngredient(name,recipe,{}));
	},
	"test should return candidate for picked singlecandidate type ingredient": function(){
		var name = "cand",
		    recipe = S.techs.nakedSingle.recipe,
			picked = {cand:5};
		assertEquals(5,S.techs.describeIngredient(name,recipe,picked));
	},
	"test should return SQUARES for empty square type ingredient": function(){
		var name = "squares",
		    recipe = {
				squares: {
					type: "square"
				}
			},
			picked = {};
		assertEquals("SQUARES",S.techs.describeIngredient(name,recipe,picked));
	},
	"test should commalist squares for picked square type ingredient": function(){
		var name = "squares",
		    recipe = {
				squares: {
					type: "square"
				}
			},
			picked = {squares:["r1c1b1","r1c2b1","r1c3b1","r1c4b2"]};
		assertEquals("r1c1b1,r1c2b1,r1c3b1,r1c4b2",S.techs.describeIngredient(name,recipe,picked));
	},
	"test should abbreviate long (more than 4) list of picked square type ingredient": function(){
		var name = "squares",
		    recipe = {
				squares: {
					type: "square"
				}
			},
			picked = {squares:["r1c1b1","r1c2b1","r1c3b1","r1c4b2","r1c5b2"]};
		assertEquals("5 squares",S.techs.describeIngredient(name,recipe,picked));
	},
	"test should return CANDIDATES for empty cand type ingredient": function(){
		var name = "cands",
		    recipe = {
				cands: {
					type: "cand"
				}
			},
			picked = {};
		assertEquals("CANDIDATES",S.techs.describeIngredient(name,recipe,picked));
	},
	"test should list picked candidates for cand type ingredient": function(){
		var name = "cands",
		    recipe = {
				cands: {
					type: "cand"
				}
			},
			picked = {cands:[1,3,4,6,8]};
		assertEquals("1,3,4,6,8",S.techs.describeIngredient(name,recipe,picked));
	},
	"test should return row/column/box for empty singleHouseType type ingredient": function(){
		var name = "house",
		    recipe = {
				house: {
					type: "singleHouseType"
				}
			},
			picked = {};
		assertEquals("row/column/box",S.techs.describeIngredient(name,recipe,picked));
	},
    "test should return rows/columns for empty singleHouseType type ingredient wiht notbox and plural flag": function(){
		var name = "house",
		    recipe = {
				house: {
					type: "singleHouseType",
					notbox: true,
					plural: true
				}
			},
			picked = {};
		assertEquals("rows/columns",S.techs.describeIngredient(name,recipe,picked));
	},
    "test should return columns/rows for empty singleHouseType type ingredient wiht notbox and plural and anti flag": function(){
		var name = "house",
		    recipe = {
				house: {
					type: "singleHouseType",
					notbox: true,
					plural: true,
					anti: true
				}
			},
			picked = {};
		assertEquals("columns/rows",S.techs.describeIngredient(name,recipe,picked));
	},
	"test should return housename for picked singleHouseType type ingredient": function(){
		var recipe = {
				house1: {
					type: "singleHouseType"
				},
                house2: {
					type: "singleHouseType"
				},
                house3: {
					type: "singleHouseType"
				}
			},
			picked = {house1:"r",house2:"c",house3:"b"};
		assertEquals("row",S.techs.describeIngredient("house1",recipe,picked));
        assertEquals("column",S.techs.describeIngredient("house2",recipe,picked));
        assertEquals("box",S.techs.describeIngredient("house3",recipe,picked));
	},
	"test should return pluralised housename for picked singleHouseType type ingredient with plural flag": function(){
		var recipe = {
				house1: {
					type: "singleHouseType",
					plural: true
				},
                house2: {
					type: "singleHouseType",
					plural: true
				},
                house3: {
					type: "singleHouseType",
					plural: true
				}
			},
			picked = {house1:"r",house2:"c",house3:"b"};
		assertEquals("rows",S.techs.describeIngredient("house1",recipe,picked));
        assertEquals("columns",S.techs.describeIngredient("house2",recipe,picked));
        assertEquals("boxes",S.techs.describeIngredient("house3",recipe,picked));
	},
	"test should correctly describe an anti housetype depending on the (selected) connected ingredient": function(){
		var recipe = {
				house1: {
					type: "singleHouseType",
					plural: true,
					notbox: true
				},
                house2: {
					type: "singleHouseType",
					anti: "house1",
					plural: true
				}
			},
			picked = {house1:"r"},
			name = "house2";
		assertEquals("columns",S.techs.describeIngredient(name,recipe,picked));
		picked = {house1:"c"};
		delete recipe.house2.plural;
		assertEquals("row",S.techs.describeIngredient(name,recipe,picked));
	}
});

     // лллллллллллллллллллллллллл Hidden Single ллллллллллллллллллллллллл 
	 
TestCase("Hidden single tech",{
	"test should be defined": function(){
		assertObject(S.techs.hiddenSingle);
	},
	"test should have description": function(){
		assertString(S.techs.hiddenSingle.description);
	},
	"test description should contain r": function(){
		assertTrue(ensureIngredientsInDescription(S.techs.hiddenSingle.description,S.techs.hiddenSingle.recipe));
	},
	"test should have selection recipe object": function(){
		var spec = S.techs.hiddenSingle.recipe,
		    exp = {
				square: {
					type: "singleSquare"
				},
				cand: {
					type: "singleCand"
				},
				houseType: {
					type: "singleHouseType"
				}
			};
		assertEquals(exp,spec);
	}
});

TestCase("Hidden single finder",{
	"test should be defined": function(){
		assertFunction(S.techs.hiddenSingle.find);
	},
	"test finder should return nothing if nothing is found": function(){
		var sud = S.sud("000000000000001000000000000100000000000000000000000000010000000000000000000000000"),
		    ret = S.techs.hiddenSingle.find(sud);
		assertUndefined(ret);
	},
	"test finder should return selection object if target found": function(){
		var sud = S.sud("000000001000001000000000000100000000000000000000000000010000000000000000000000000"),
		    ret = S.techs.hiddenSingle.find(sud),
			expected = {
				square: "r3c3b1",
				cand: 1,
			    houseType: "r"
			};
		assertEquals(expected,ret);
	}
});

TestCase("Hidden single ingredients checker",{
	"test should be defined": function(){
		assertFunction(S.techs.hiddenSingle.check);
	},
	"test should return error if target cannot be cand": function(){
		var sud = S.sud(),
		    ingr = {
				cand: 5,
				square: "r1c1b1"
			},
			exp = {
				msg:"Chosen square cannot be 5!",
				sqrids:["r1c1b1"],
				ingr:["cand","square"]
			};
		S.sud.block(sud,"r1c1b1",5,"m");
		assertEquals(exp,S.techs.hiddenSingle.check(sud,ingr));
	},
	"test should return error if other squares in house can be cand": function(){
        var sud = S.sud(),
		    ingr = {
				cand: 5,
				square: "r1c1b1",
				houseType: "b"
			},
			exp = {
				msg:"There are other possibilities for 5 in the box!",
				sqrids:["r1c2b1","r1c3b1","r2c1b1","r2c2b1","r2c3b1","r3c1b1","r3c2b1","r3c3b1"],
				ingr:["cand"]
			};
		assertEquals(exp,S.techs.hiddenSingle.check(sud,ingr));
	},
	"test should return nothing for correct selection": function(){
        var sud = S.sud("000000001000001000000000000100000000000000000000000000010000000000000000000000000"),
		    ingr = {
				square: "r3c3b1",
				cand: 1,
				houseType: "c"
			};
	    assertUndefined(S.techs.hiddenSingle.check(sud,ingr));
	}
});

TestCase("Hidden single highlighter",{
	"test should be defined": function(){
		assertFunction(S.techs.hiddenSingle.highlight);
	},
	"test should not highlight anything if not square and housetype chosen":function(){
		var sud = S.sud(), ingr = {
			square: "r4c6b5"
		};
		assertEquals([],S.techs.hiddenSingle.highlight(sud,ingr));
	}, 
	"test should highlight the chosen housetype around the square": function(){
		var sud = S.sud(), ingr = {
			square: "r4c6b5",
			houseType: "b"
		};
		assertEquals(["b5"],S.techs.hiddenSingle.highlight(sud,ingr));
	}
});

TestCase("Hidden single resulter",{
	"test should be defined": function(){
		assertFunction(S.techs.hiddenSingle.result);
	},
	"test should return correct result object": function(){
		var sud = S.sud("000000001000001000000000000100000000000000000000000000010000000000000000000000000"),
		    ingr = S.techs.hiddenSingle.find(sud),
			res = S.techs.hiddenSingle.result(sud,ingr), 
		    expected = {answers:[[ingr.square,ingr.cand]]};
		assertEquals(expected,res);
	}
});

TestCase("Hidden single reality checker",{ // TODO - fix
	"test real-life test": function(){
		var sud = S.sud("000000001000001000000000000100000000000000000000000000010000000000000000000000000"),
		    ingr = S.techs.hiddenSingle.find(sud),
			ok = S.techs.hiddenSingle.check(sud,ingr);
		//assertEquals(S.C.success,ok);
	//	S.techs.hiddenSingle.perform(sud,ingr);
	//	assertEquals(1,sud.sqrs.r3c3b1.ac);
	}
});


     // лллллллллллллллллллллллллл Naked Single ллллллллллллллллллллллллл 
	 
TestCase("Naked single tech",{
	"test should be defined": function(){
		assertObject(S.techs.nakedSingle);
	},
	"test should have description": function(){
		assertString(S.techs.nakedSingle.description);
	},
	"test description should contain all ingredients": function(){
		assertTrue(ensureIngredientsInDescription(S.techs.nakedSingle.description,S.techs.nakedSingle.recipe));
	},
	"test should have ingredients object": function(){
		var spec = S.techs.nakedSingle.recipe, exp = {
			square: {
				type: "singleSquare"
			},
			cand: {
				type: "singleCand"
			}
		};
		assertEquals(exp,spec);
	}
});

TestCase("Naked single highlighter",{
	"test should be defined": function(){
		assertFunction(S.techs.nakedSingle.highlight);
	},
	"test should not highlight anything": function(){
		assertEquals([],S.techs.nakedSingle.highlight(S.sud(),{}));
	}
});

TestCase("Naked single finder", {
	"test should be defined": function(){
		assertFunction(S.techs.nakedSingle.find);
	},
	"test finder should return nothing if nothing is found": function(){
		var sud = S.sud("000000000000001000000000000100000000000000000000000000010000000000000000000000000"),
		    ret = S.techs.nakedSingle.find(sud);
		assertUndefined(ret);
	},
	"test finder should return selection object if target found": function(){
		var sud = S.sud("123456780000000000000000000000000000000000000000000000000000000000000000000000000"),
		    ret = S.techs.nakedSingle.find(sud),
			expected = {
				square: "r1c9b3",
				cand: 9
			};
		assertEquals(expected,ret);
	}
});

TestCase("Naked single ingredients checker",{
	"test should be defined": function(){
		assertFunction(S.techs.nakedSingle.check);
	},
	"test should return error if target cannot be cand": function(){
		var sud = S.sud(),
		    sqrid = "r1c1b1",
		    ingr = {
				square: sqrid,
				cand: 1
			},
			exp= {
				msg:"Target square cannot be 1!",
				sqrids:[sqrid],
				ingr: ["cand","square"]
			};
		S.sud.block(sud,sqrid,1,"m");
		assertEquals(exp,S.techs.nakedSingle.check(sud,ingr));
	},
	"test should return error if target has more possibilities": function(){
		var sud = S.sud(),
		    sqrid = "r1c1b1",
		    ingr = {
				square: sqrid,
				cand: 1
			},
			exp= {
				msg:"Target square has other candidate possibilities too!",
				sqrids:[sqrid],
				ingr: ["square"]
			};
		assertEquals(exp,S.techs.nakedSingle.check(sud,ingr));
	},
	"test should return nothing for correct selection": function(){
        var sud = S.sud("123456780000000000000000000000000000000000000000000000000000000000000000000000000"),
		    ingr = {
				square: "r1c9b3",
				cand: 9
			};
		assertUndefined(S.techs.nakedSingle.check(sud,ingr));
	}
});

TestCase("Naked single resulter",{
	"test should be defined": function(){
		assertFunction(S.techs.nakedSingle.result);
	},
	"test should return correct result object": function(){
		var ingr = {
				square: "r1c9b3",
				cand: 9
			},
		    expected = {answers:[ingr.square,ingr.cand]};
		assertEquals(expected,S.techs.nakedSingle.result(S.sud(),ingr));
	}
});

TestCase("Naked single reality checker",{ // TODO - fix
	"test real-life test": function(){
		var sud = S.sud("123456780000000000000000000000000000000000000000000000000000000000000000000000000"),
		    ingr = S.techs.nakedSingle.find(sud),
			ok = S.techs.nakedSingle.check(sud,ingr);
		//assertEquals(S.C.success,ok);
		//S.techs.nakedSingle.perform(sud,ingr);
		//assertEquals(9,sud.sqrs.r1c9b3.ac);
	}
});

     // лллллллллллллллллллллллллл Hidden Subset ллллллллллллллллллллллллл
	 
TestCase("Hidden Subset definition",{
	"test should be defined": function(){
		assertObject(S.techs.hiddenSubset);
	},
	"test should have description": function(){
		assertString(S.techs.hiddenSubset.description);
	},
	"test description should contain all ingredients": function(){
		assertTrue(ensureIngredientsInDescription(S.techs.hiddenSubset.description,S.techs.hiddenSubset.recipe));
	},
	"test should have recipe specification": function(){
		var spec = {
			subset: {
				type: "square",
				shownum: true,
				min: 2
			},
			cands: {
				type: "cand",
				shownum: true,
				min: 2
			},
			houseType: {
				type: "singleHouseType"
			}
		};
		assertEquals(spec,S.techs.hiddenSubset.recipe);
	}
});

TestCase("Hidden Subset highlighter",{
	"test should be defined": function(){
		assertFunction(S.techs.hiddenSubset.highlight);
	},
	"tests should return nothing if not square and housetype": function(){
		var sud = S.sud(), ingr = {
			subset: S.sel(["r1c1b1"])
		};
		assertEquals([],S.techs.hiddenSubset.highlight(sud,ingr));
	},
	"tests should return nothing if squares don't all share the housetype": function(){
		var sud = S.sud(), ingr = {
			subset: S.sel(["r1c1b1","r2c2b1"]),
			houseType: "c"
		};
		assertEquals([],S.techs.hiddenSubset.highlight(sud,ingr));
	},
	"tests should return the housetype if it contains all squares": function(){
		var sud = S.sud(), ingr = {
			subset: S.sel(sud,["r1c1b1","r2c2b1"]),
			houseType: "b"
		};
		assertEquals(["b1"],S.techs.hiddenSubset.highlight(sud,ingr));
	}
});

TestCase("Hidden Subset checker",{
	"test should be defined": function(){
		assertFunction(S.techs.hiddenSubset.check);
	},
	"test should return error if squares don't share the given house": function(){
		var sud = S.sud(),
		    squares = ["r1c1b1","r2c1b1"],
		    sel = S.sel(sud,squares),
			ingr = {subset:sel,houseType: "r"},
			exp = {
				msg:"Chosen squares do not share row!",
				sqrids:squares,
				ingr: ["houseType","subset"]
			};
		assertEquals(exp,S.techs.hiddenSubset.check(sud,ingr));
	},
	"test should return error if not same number of squares and cands": function(){
		var sud = S.sud(), squares = ["r1c1b1", "r2c1b1"], sel = S.sel(sud, squares), ingr = {
			subset: sel,
			houseType: "c",
			cands: [1, 2, 3]
		}, exp = {
			msg: "Must be equal number of squares and candidates!",
			ingr: ["cands","subset"]
		};
		assertEquals(exp,S.techs.hiddenSubset.check(sud,ingr));
	},
	"test should return error if included square has none of the candidates": function(){
        var sud = S.sud(),
		    sel = S.sel(),
			cands = [1,2],
			exp = {
				msg: "Subset contains squares with no possibilities for any of the chosen candidates!",
				sqrids: ["r1c1b1"],
				ingr: ["cands","subset"]
			};
		S.sud.block(sud,"r1c1b1",1,"m");
		S.sud.block(sud,"r1c1b1",2,"m");
		S.sel.add(sud,sel,"r1c1b1");
		S.sel.add(sud,sel,"r1c2b1");
		assertEquals(exp,S.techs.hiddenSubset.check(sud,{subset:sel,cands:cands,houseType:"r"}));
	},
	"test should return error if other squares in given house can be any of the cands": function(){
        var sud = S.sud(),
		    sel = S.sel(),
			cands = [1,2],
			exp = {
				msg: "There are other possibilities in the row for some of the chosen candidates!",
				sqrids: ["r1c3b1","r1c4b2","r1c5b2","r1c6b2","r1c7b3","r1c8b3"],
				ingr: ["cands","houseType"]
			};
		S.sud.block(sud,"r1c9b3",1,"m");
		S.sud.block(sud,"r1c9b3",2,"m");
		S.sel.add(sud,sel,"r1c1b1");
		S.sel.add(sud,sel,"r1c2b1");
		assertEquals(exp,S.techs.hiddenSubset.check(sud,{subset:sel,cands:cands,houseType:"r"}));
	},
	"test should return error if subset contains no other candidates": function(){
		var sud = S.sud(),
		    sel,
			sqrs = ["r1c1b1","r1c5b2","r1c9b3"],
			cands = [1,2,3],
			exp = {
				msg: "Subset contains no other candidates, so nothing will be blocked!",
				sqrids: sqrs,
				ingr:["subset"]
			};
		sqrs.map(function(sqrid){
			[4,5,6,7,8,9].map(function(c){
				S.sud.block(sud,sqrid,c,"m");
			});
		});
		sel = S.sel(sud,sqrs);
		assertEquals(exp,S.techs.hiddenSubset.check(sud,{subset:sel,cands:cands,houseType:"r"}));
	},
	"test should return nothing for correct hidden subset": function(){
		var sud = S.sud(), ingr;
		["r1c1b1","r1c2b1","r1c3b1","r1c4b2","r1c5b2","r1c6b2","r1c7b3"].map(function(sqrid){
			S.sud.block(sud,sqrid,1,"m");
			S.sud.block(sud,sqrid,2,"m");
		});
		ingr = {
			subset: S.sel(sud,["r1c8b3","r1c9b3"]),
			cands: [1,2],
			houseType: "r"
		};
		assertUndefined(S.techs.hiddenSubset.check(sud,ingr));
	}
});

TestCase("Hidden subset resulter",{
	"test should be defined": function(){
		assertFunction(S.techs.hiddenSubset.result);
	},
	"test should return correct result object": function(){
        var sud = S.sud(), ingr;
		["r1c1b1","r1c2b1","r1c3b1","r1c4b2","r1c5b2","r1c6b2","r1c7b3"].map(function(sqrid){
			S.sud.block(sud,sqrid,1,"m");
			S.sud.block(sud,sqrid,2,"m");
		});
		ingr = {
			subset: S.sel(sud,["r1c8b3","r1c9b3"]),
			cands: [1,2],
			houseType: "r"
		};
		var expected = {blocks:[["r1c8b3",3],["r1c8b3",4],["r1c8b3",5],["r1c8b3",6],["r1c8b3",7],["r1c8b3",8],["r1c8b3",9],
		                        ["r1c9b3",3],["r1c9b3",4],["r1c9b3",5],["r1c9b3",6],["r1c9b3",7],["r1c9b3",8],["r1c9b3",9]]};
		assertEquals(expected,S.techs.hiddenSubset.result(sud,ingr));
	}
});

TestCase("Hidden subset finder",{
    "test should be defined": function(){
		assertFunction(S.techs.hiddenSubset.find);
	},
	"test should return nothing when nothing is found": function(){
		assertUndefined(S.techs.hiddenSubset.find(S.sud()));
	},
	"test should return ingredient object for hidden subset": function(){
		var sud = S.sud(), ingr;
		["r1c1b1","r1c2b1","r1c3b1","r1c4b2","r1c5b2","r1c6b2","r1c7b3"].map(function(sqrid){
			S.sud.block(sud,sqrid,1,"m");
			S.sud.block(sud,sqrid,2,"m");
		});
		ingr = {
			subset: S.sel(sud,["r1c8b3","r1c9b3"]),
			cands: [1,2],
			houseType: "r"
		};
		assertEquals(ingr,S.techs.hiddenSubset.find(sud));
	}
});

     // лллллллллллллллллллллллллл Naked Subset ллллллллллллллллллллллллл

TestCase("Naked subset definition",{
	"test should be defined": function(){
		assertObject(S.techs.nakedSubset);
	},
	"test should have description": function(){
		assertString(S.techs.nakedSubset.description);
	},
	"test description should contain all ingredients": function(){
		assertTrue(ensureIngredientsInDescription(S.techs.nakedSubset.description,S.techs.nakedSubset.recipe));
	},
	"test should have recipe definition": function(){
		var exp = {
			subset: {
				type: "square",
				shownum: true,
				min: 2
			},
			cands: {
				type: "cand",
				shownum: true,
				min: 2
			},
			houseType: {
				type: "singleHouseType"
			}
		};
		assertEquals(exp,S.techs.nakedSubset.recipe);
	}
});

TestCase("Naked Subset highlighter",{
	"test should be defined": function(){
		assertFunction(S.techs.nakedSubset.highlight);
	},
	"tests should return nothing if not square and housetype": function(){
		var sud = S.sud(), ingr = {
			subset: S.sel(["r1c1b1"])
		};
		assertEquals([],S.techs.nakedSubset.highlight(sud,ingr));
	},
	"tests should return nothing if squares don't all share the housetype": function(){
		var sud = S.sud(), ingr = {
			subset: S.sel(["r1c1b1","r2c2b1"]),
			houseType: "c"
		};
		assertEquals([],S.techs.nakedSubset.highlight(sud,ingr));
	},
	"tests should return the housetype if it contains all squares": function(){
		var sud = S.sud(), ingr = {
			subset: S.sel(sud,["r1c1b1","r2c2b1"]),
			houseType: "b"
		};
		assertEquals(["b1"],S.techs.nakedSubset.highlight(sud,ingr));
	}
});

TestCase("Naked subset checker",{
	"test should be defined": function(){
		assertFunction(S.techs.nakedSubset.check);
	},
	"test should throw error if squares don't share the given house": function(){
		var sud = S.sud(),
		    squares = ["r1c1b1","r2c1b1"],
		    sel = S.sel(sud,squares),
			ingr = {
				subset: sel,
				houseType: "r"
			},
			exp = {
				msg: "Chosen squares do not share row!",
				sqrids: squares,
				ingr: ["houseType","subset"]
			};
		assertEquals(exp,S.techs.nakedSubset.check(sud,ingr));
	},
	"test should throw error if not same number of squares and cands": function(){
		var sud = S.sud(),
		    squares = ["r1c1b1","r2c1b1"],
		    sel = S.sel(sud,squares),
			ingr = {
				subset: sel,
				houseType: "c",
			    cands: [1,2,3] 
			},
			exp = {
				msg: "Must be equal number of squares and candidates!",
				ingr: ["cands","subset"]
			};
		assertEquals(exp,S.techs.nakedSubset.check(sud,ingr));
	},
	"test should return error if included squares have non-included cands": function(){
		var sud = S.sud(),
		    squares = ["r1c1b1","r2c1b1","r3c1b1"],
			ingr = {
				houseType: "c",
				cands: [1,2,3]
			},
			exp = {
				msg: "Subset contains possibilities for other candidates!",
				sqrids: ["r1c1b1","r2c1b1"],
				ingr: ["subset"]
			};
		[4,5,6,7,8,9].map(function(c){
			S.sud.block(sud,"r3c1b1",c,"m");
		});
		ingr.subset = S.sel(sud,squares);
		assertEquals(exp,S.techs.nakedSubset.check(sud,ingr));
	},
	"test should return error if cands dont occur in the other squares": function(){
        var sud = S.sud(),
		    sel = S.sel(),
			cands = [1,2],
			othercands = [3,4,5,6,7,8,9],
			exp = {
				msg: "None of the other squares in the row contain possibilities for the chosen candidates, so nothing will be blocked!",
				ingr: ["cands"],
				sqrids: ["r1c3b1","r1c4b2","r1c5b2","r1c6b2","r1c7b3","r1c8b3","r1c9b3"]
			};
		othercands.map(function(c){
			S.sud.block(sud,"r1c1b1",c,"m");
			S.sud.block(sud,"r1c2b1",c,"m");
		});
		Array.filterAll(S.house.sqrs.r1,["r1c1b1","r1c2b1"]).map(function(sqrid){
			S.sud.block(sud,sqrid,1,"m");
			S.sud.block(sud,sqrid,2,"m");
		});
		S.sel.add(sud,sel,"r1c1b1");
		S.sel.add(sud,sel,"r1c2b1");
		assertEquals(exp,S.techs.nakedSubset.check(sud,{subset:sel,cands:cands,houseType:"r"}));
	},
	"test should return nothing if ingredients are ok": function(){
        var sud = S.sud(),
		    sel = S.sel(),
			cands = [1,2],
			othercands = [3,4,5,6,7,8,9],
			ingr;
		othercands.map(function(c){
			S.sud.block(sud,"r1c1b1",c,"m");
			S.sud.block(sud,"r1c2b1",c,"m");
		});
		S.sel.add(sud,sel,"r1c1b1");
		S.sel.add(sud,sel,"r1c2b1");
		ingr = {
			cands: [1, 2],
			houseType: "r",
			subset: sel
		}; 
		assertUndefined(S.techs.nakedSubset.check(sud,ingr));		
	}
});

TestCase("Naked subset resulter",{
	"test should be defined": function(){
		assertFunction(S.techs.nakedSubset.result);
	},
	"test should return correct result object": function(){
		var sud = S.sud(), ingr = {
			cands: [1,2,3,4],
			houseType: "r",
			subset: S.sel(sud,["r1c1b1","r1c2b1","r1c3b1","r1c4b2"])
		},
		expected = {
			blocks: [
			    ["r1c5b2",1],["r1c5b2",2],["r1c5b2",3],["r1c5b2",4],
				["r1c6b2",1],["r1c6b2",2],["r1c6b2",3],["r1c6b2",4],
				["r1c7b3",1],["r1c7b3",2],["r1c7b3",3],["r1c7b3",4],
				["r1c8b3",1],["r1c8b3",2],["r1c8b3",3],["r1c8b3",4],
				["r1c9b3",1],["r1c9b3",2],["r1c9b3",3],["r1c9b3",4]
			]
		},
		result = S.techs.nakedSubset.result(sud,ingr);
		assertEquals(expected,result);
	}
});

TestCase("Naked subset finder",{
    "test should be defined": function(){
		assertFunction(S.techs.nakedSubset.find);
	},
	"test should return nothing when nothing is found": function(){
		assertUndefined(S.techs.nakedSubset.find(S.sud()));
	},
	"test should return ingredient object for naked subset": function(){
        var sud = S.sud(),
		    sel = S.sel(),
			cands = [1,2],
			othercands = [3,4,5,6,7,8,9],
			ingr;
		othercands.map(function(c){
			S.sud.block(sud,"r1c1b1",c,"m");
			S.sud.block(sud,"r1c2b1",c,"m");
		});
		S.sel.add(sud,sel,"r1c1b1");
		S.sel.add(sud,sel,"r1c2b1");
		ingr = {
			cands: [1, 2],
			houseType: "r",
			subset: sel
		}; 
		assertEquals(ingr,S.techs.nakedSubset.find(sud));
	}
});

TestCase("Naked subset reality check",{
	"test all should work": function(){
		var sud = S.sud();
		[3,4,5,6,7,8,9].map(function(cand){
			S.sud.block(sud,"r1c1b1",cand,"m");
			S.sud.block(sud,"r1c2b1",cand,"m");
		});
		var ingr = S.techs.nakedSubset.find(sud);
		assertUndefined(S.techs.nakedSubset.check(sud,ingr));
		//S.techs.nakedSubset.perform(sud,ingr);
		//assertEquals(S.C.hasblock,S.sqr.canBe(sud.sqrs.r1c9b3,1));
	}
});

     // лллллллллллллллллллллллллл Locked Candidates ллллллллллллллллллллллллл

TestCase("Locked candidates definition",{
	"test should be defined": function(){
		assertObject(S.techs.lockedCandidates);
	},
	"test should have description":function(){
		assertString(S.techs.lockedCandidates.description);
	},
	"test description should contain all ingredients": function(){
		assertTrue(ensureIngredientsInDescription(S.techs.lockedCandidates.description,S.techs.lockedCandidates.recipe));
	},
	"test should have recipe definition": function(){
		var exp = {
			squares: {
				type: "square",
				min: 2,
				max: 3
			},
			cand: {
				type: "singleCand"
			},
			candsin: {
				type: "singleHouseType",
				oneboxwith: "deletefrom"
			},
			deletefrom: {
				type: "singleHouseType",
				oneboxwith: "candsin"
			}
		};
		assertEquals(exp,S.techs.lockedCandidates.recipe);
	}
});

TestCase("Locked candidates highlighter",{
	"test should be defined": function(){
		assertFunction(S.techs.lockedCandidates.highlight);
	},
	"test should return nothing if no housetypes are selected": function(){
		assertEquals({},S.techs.lockedCandidates.highlight(S.sud(),{}));
	},
	"test should return nothing if squares don't share selected type": function(){
		var sud = S.sud(), ingr = {
			squares: S.sel(sud,["r1c1b1","r1c9b3"]),
			candsin: "c",
			deletefrom: "b" 
		};
		assertEquals([],S.techs.lockedCandidates.highlight(S.sud(),{}));
	},
	"test should return shared selected housetype": function(){
		var sud = S.sud(), ingr = {
			squares: S.sel(sud,["r1c1b1","r1c9b3"]),
			candsin: "r",
			deletefrom: "b" 
		};
		assertEquals(["r1"],S.techs.lockedCandidates.highlight(S.sud(),ingr));
	},
	"test should return both housetypes if both are shared": function(){
		var sud = S.sud(), ingr = {
			squares: S.sel(sud,["r1c1b1","r1c3b1"]),
			candsin: "r",
			deletefrom: "b" 
		};
		assertEquals(["r1","b1"],S.techs.lockedCandidates.highlight(S.sud(),ingr));
	}
});

TestCase("Locked candidates checker",{
	"test should be defined":function(){
		assertFunction(S.techs.lockedCandidates.check);
	},
	"test should return error if not all squares share candsin house": function(){
		var sud = S.sud(),
		    sqrids = ["r1c1b1","r1c9b3"],
		    ingr = {
				cand: 5,
				candsin: "c",
				deletefrom: "b",
				squares: S.sel(sud,sqrids) 
			},
			exp = {
				msg: "Chosen squares do not share a column!",
				sqrids: sqrids,
				ingr: ["candsin"]
			};
		assertEquals(exp,S.techs.lockedCandidates.check(sud,ingr));
	},
	"test should return error msg if not all squares share deletefrom house": function(){
		var sud = S.sud(),
		    sqrids = ["r1c1b1","r1c9b3"],
		    ingr = {
				cand: 5,
				candsin: "r",
				deletefrom: "b",
				squares: S.sel(sud,sqrids) 
			},
			exp = {
				msg: "Chosen squares do not share a box!",
				sqrids: sqrids,
				ingr: ["deletefrom"]
			};
		assertEquals(exp,S.techs.lockedCandidates.check(sud,ingr));
	},
	"test should return error if other squares in candsin can be cand": function(){
        var sud = S.sud(),
		    ingr = {
				cand: 5,
				candsin: "r",
				deletefrom: "b",
				squares: S.sel(sud,["r1c1b1","r1c2b1"])
			},
			exp = {
				msg: "There are other possibilities in the row for 5!",
				sqrids: ["r1c3b1","r1c4b2","r1c5b2","r1c6b2","r1c7b3","r1c8b3","r1c9b3"],
				ingr: ["cand","candsin"]
			};
		assertEquals(exp,S.techs.lockedCandidates.check(sud,ingr));
	},
    "test return error if no squares in deletefrom can be cand": function(){
        var sud = S.sud(),
		    ingr = {
				cand: 5,
				candsin: "r",
				deletefrom: "b",
				squares: S.sel(sud,["r1c1b1","r1c2b1"])
			},
			exp = {
				msg: "There are no possibilities for 5 in the rest of the box, so nothing will be blocked!",
				ingr: ["cand","deletefrom"],
				sqrids: ["r2c1b1","r2c2b1","r2c3b1","r3c1b1","r3c2b1","r3c3b1"]
			};
		(Array.filterAll(S.house.sqrs.r1,ingr.squares.sqrs)).map(function(sqrid){
			S.sud.block(sud,sqrid,5,"m");
		});
		(Array.filterAll(S.house.sqrs.b1,ingr.squares.sqrs)).map(function(sqrid){
			S.sud.block(sud,sqrid,5,"m");
		});
		assertEquals(exp,S.techs.lockedCandidates.check(sud,ingr));
	},
	"test should return nothing for correct ingredients": function(){
        var sud = S.sud(),
		    ingr = {
				cand: 5,
				candsin: "r",
				deletefrom: "b",
				squares: S.sel(sud,["r1c1b1","r1c2b1"])
			};
		(Array.filterAll(S.house.sqrs.r1,ingr.squares.sqrs)).map(function(sqrid){
			S.sud.block(sud,sqrid,5,"m");
		});
		assertUndefined(S.techs.lockedCandidates.check(sud,ingr));
	}
});

TestCase("LockedCandidates finder",{
	"test should be defined": function(){
		assertFunction(S.techs.lockedCandidates.find);
	},
	"test should return nothing if no locked candidates": function(){
		assertUndefined(S.techs.lockedCandidates.find(S.sud()));
	},
	"test should return correct ingredients for type1 row lockedCandidates": function(){
        var sud = S.sud(),
		    ingr = {
				cand: 5,
				candsin: "r",
				deletefrom: "b",
				squares: S.sel(sud,["r1c1b1","r1c2b1"])
			};
		(Array.filterAll(S.house.sqrs.r1,ingr.squares.sqrs)).map(function(sqrid){
			S.sud.block(sud,sqrid,5,"m");
		});
		var ret = S.techs.lockedCandidates.find(sud);
		assertEquals(ingr,ret);
	},
	"test should return correct ingredients for type1 col lockedCandidates": function(){
        var sud = S.sud(),
		    ingr = {
				cand: 5,
				candsin: "c",
				deletefrom: "b",
				squares: S.sel(sud,["r1c1b1","r2c1b1"])
			};
		(Array.filterAll(S.house.sqrs.c1,ingr.squares.sqrs)).map(function(sqrid){
			S.sud.block(sud,sqrid,5,"m");
		});
		var ret = S.techs.lockedCandidates.find(sud);
		assertEquals(ingr,ret);
	},
	"test should return correct ingredients for type2 row locked Candidates": function(){
        var sud = S.sud(),
		    ingr = {
				cand: 5,
				candsin: "b",
				deletefrom: "r",
				squares: S.sel(sud,["r1c1b1","r1c2b1"])
			};
		(Array.filterAll(S.house.sqrs.b1,ingr.squares.sqrs)).map(function(sqrid){
			S.sud.block(sud,sqrid,5,"m");
		});
		var ret = S.techs.lockedCandidates.find(sud);
		assertEquals(ingr,ret);
	},
	"test should return correct ingredients for type2 col locked Candidates": function(){
        var sud = S.sud(),
		    ingr = {
				cand: 5,
				candsin: "b",
				deletefrom: "c",
				squares: S.sel(sud,["r1c1b1","r2c1b1"])
			};
		(Array.filterAll(S.house.sqrs.b1,ingr.squares.sqrs)).map(function(sqrid){
			S.sud.block(sud,sqrid,5,"m");
		});
		var ret = S.techs.lockedCandidates.find(sud);
		assertEquals(ingr,ret);
	}
});

TestCase("Locked candidate result",{
	"test should be defined": function(){
		assertFunction(S.techs.lockedCandidates.result);
	},
	"test should return correct results object": function(){
		var sud = S.sud(),
		    ingr = {
				cand: 5,
				candsin: "b",
				deletefrom: "c",
				squares: S.sel(sud,["r1c1b1","r2c1b1"])
			},
			expected = {
				blocks: [
				    ["r4c1b4",5],["r5c1b4",5],["r6c1b4",5],["r7c1b7",5],["r8c1b7",5],["r9c1b7",5]
				]
			};
		assertEquals(expected,S.techs.lockedCandidates.result(sud,ingr));
	}
});

// лллллллллллллллллллллллллл Fish (x-wing etc) ллллллллллллллллллллллллл

TestCase("fish definition",{
	"test should be defined": function(){
		assertObject(S.techs.fish);
	},
	"test should have recipe definition": function(){
		var ingr = {
			cand: {
				type: "singleCand"
			},
			orientation: {
				type: "singleHouseType",
				notbox: true,
				plural: true
			},
			antiorientation: {
				type: "singleHouseType",
				notbox: true,
				plural: true,
				anti: "orientation"
			},
			sel: {
				type: "square"
			}
		};
		assertEquals(ingr,S.techs.fish.recipe);
	},
	"test should have description": function(){
		assertString(S.techs.fish.description);
	},
	"test description should contain all ingredients": function(){
		assertTrue(ensureIngredientsInDescription(S.techs.fish.description,S.techs.fish.recipe));
	}
});

TestCase("fish highlighter",{
	"test should be defined": function(){
		assertFunction(S.techs.fish.highlight);
	},
	"test should return nothing if no squares are selected": function(){
		assertEquals([],S.techs.fish.highlight(S.sud(),{}));
	},
	"test should highlight all rows and columns": function(){
		var sud = S.sud(), ingr = {
			sel: S.sel(sud,["r2c2b1","r5c5b5","r6c6b5","r6c9b6"])
		};
		assertEquals(["r2","r5","r6","c2","c5","c6","c9"],S.techs.fish.highlight(S.sud(),ingr));
	}
});

TestCase("fish checker",{
	"test should be defined": function(){
		assertFunction(S.techs.fish.check);
	},
	"test should return error if not all squares contain cand": function(){
		var sud = S.sud(), sel, cand = 5, ingr,
		exp = {
			msg: "Not all selected squares can be 5!",
			ingr: ["cand","sel"],
			sqrids: ["r1c1b1"]
		};
		S.sud.block(sud,"r1c1b1",cand,"m");
		sel = S.sel(sud,["r1c1b1","r1c5b2","r5c1b4","r5c5b5"]);
		ingr = {
			cand: cand,
			orientation: "r",
			sel: sel
		};
		assertEquals(exp,S.techs.fish.check(sud,ingr));
	},
	"test should throw error if not same number of cols and rows": function(){
        var sud = S.sud(), sel, cand = 5, ingr,
		exp = {
			msg: "Squares must share same number of rows and columns!",
			ingr: ["sel"]
		};
		sel = S.sel(sud,["r1c1b1","r1c5b2","r6c1b4","r5c5b5"]);
		ingr = {
			cand: cand,
			orientation: "r",
			sel: sel
		};
		assertEquals(exp,S.techs.fish.check(sud,ingr));
	},
	"test should return error if other squares in [orientation] can have cand": function(){
		var sud = S.sud(), sel = S.sel(sud,["r1c1b1","r1c5b2","r5c1b4","r5c5b5"]), cand = 5,
		ingr = {
			cand: cand,
			orientation: "r",
			sel: sel
		},
		exp = {
			msg:"There are other possibilities for 5 in those rows!",
			sqrids: ["r1c2b1","r1c3b1","r1c4b2","r1c6b2","r1c7b3","r1c8b3","r5c2b4","r5c3b4","r5c4b5","r5c6b5","r5c7b6","r5c8b6","r5c9b6"]
		};
		S.sud.block(sud,"r1c9b3",cand,"m");
		assertEquals(exp,S.techs.fish.check(sud,ingr));
	},
	"test should return error if no squares in [nonorientation] can have cand": function(){
		var sud = S.sud(),
		    sqrids = ["r1c1b1","r1c5b2","r5c1b4","r5c5b5"], cand = 5, ingr, sel,
		exp = {
			msg: "There are no other possibilities for 5 in those columns, so nothing will be blocked!",
			sqrids: ["r2c1b1","r3c1b1","r4c1b4","r6c1b4","r7c1b7","r8c1b7","r9c1b7",
			         "r2c5b2","r3c5b2","r4c5b5","r6c5b5","r7c5b8","r8c5b8","r9c5b8"],
			ingr: ["cand","orientation"]
		};
	    Array.filterAll(S.house.sqrs.r1.concat(S.house.sqrs.r5),sqrids).map(function(sqrid){
			S.sud.block(sud,sqrid,cand,"m");
		});
	    Array.filterAll(S.house.sqrs.c1.concat(S.house.sqrs.c5),sqrids).map(function(sqrid){
			S.sud.block(sud,sqrid,cand,"m");
		});
		ingr = {
			cand: cand,
			orientation: "r",
			sel: S.sel(sud,sqrids)
		};
		assertEquals(exp,S.techs.fish.check(sud,ingr));
	},
	"test should return nothing for correct ingredients": function(){
        var sud = S.sud(),
		    sqrids = ["r1c1b1","r1c5b2","r5c1b4","r5c5b5"], cand = 5, ingr, sel;
	    Array.filterAll(S.house.sqrs.r1.concat(S.house.sqrs.r5),sqrids).map(function(sqrid){
			S.sud.block(sud,sqrid,cand,"m");
		});
		ingr = {
			cand: cand,
			orientation: "r",
			sel: S.sel(sud,sqrids)
		};
		assertUndefined(S.techs.fish.check(sud,ingr));
	}
});

TestCase("Fish finder",{
	"test should be defined": function(){
		assertFunction(S.techs.fish.find);
	},
	"test should return nothing if no fish in sudoku": function(){
		assertUndefined(S.techs.fish.find(S.sud()));
	},
	"test should return ingredients for found fish": function(){
        var sud = S.sud(),
		    sqrids = ["r1c1b1","r1c5b2","r5c1b4","r5c5b5"], cand = 5, ingr, sel;
	    Array.filterAll(S.house.sqrs.r1.concat(S.house.sqrs.r5),sqrids).map(function(sqrid){
			S.sud.block(sud,sqrid,cand,"m");
		});
		ingr = {
			cand: cand,
			orientation: "r",
			sel: S.sel(sud,sqrids)
		};
		assertEquals(ingr,S.techs.fish.find(sud));
	}
});

TestCase("Fish resulter",{
	"test should be defined": function(){
		assertFunction(S.techs.fish.result);
	},
	"test should return correct result object": function(){
		var sud = S.sud(),
		    ingr = {
				cand: 5,
				orientation: "r",
				sel: S.sel(sud,["r1c1b1","r1c5b2","r5c1b4","r5c5b5"])
			},
		    expected = {
				blocks: [
				    ["r2c1b1",5],["r3c1b1",5],["r4c1b4",5],["r6c1b4",5],["r7c1b7",5],["r8c1b7",5],["r9c1b7",5],
					["r2c5b2",5],["r3c5b2",5],["r4c5b5",5],["r6c5b5",5],["r7c5b8",5],["r8c5b8",5],["r9c5b8",5]
				]
			},
			result = S.techs.fish.result(sud,ingr);
		assertEquals(expected,result);
	}
});

/******************************** UI tests ***********************************/

TestCase("UI definition",{
	"test should be defined":function(){
		assertObject(S.UI);
	}
});

TestCase("UI selectTech function",{
	"test should be defined": function(){
		assertFunction(S.UI.selectTech);
	},
	"test should throw error if tech does not exist": function(){
		var sud = S.sud(), tech="FOOBAR";
		assertException(function(){
		    S.UI.selectTech(sud,tech);
	    });
	},
	"test should set sud property to chosen tech": function(){
		var sud = S.sud(), tech="nakedSingle";
		S.UI.selectTech(sud,tech);
		assertEquals(tech,sud.currentTech);
	},
	"test should set sud picked ingredients prop to empty object": function(){
		var sud = S.sud(), tech="nakedSingle";
		S.UI.selectTech(sud,tech);
		assertEquals({},sud.pickedIngredients);
	},
	"test should select first ingredient in tech": function(){
		var sud = S.sud(), tech="hiddenSingle";
		S.UI.selectTech(sud,tech);
		// TODO - make sure with sinon that selectIngredient is called
		assertEquals("square",sud.currentIngredient);
	}
});

TestCase("UI selectIngredient function",{
	"test should be defined": function(){
		assertFunction(S.UI.selectIngredient);
	},
	"test should throw error if no tech is set": function(){
		assertException(function(){
			S.UI.selectIngredient(S.sud(), "FOOBAR");
		});
	},
	"test should throw exception if no ingredient by that name in current tech": function(){
		var sud = S.sud();
		S.UI.selectTech(sud,"hiddenSingle");
		assertException(function(){
			S.UI.selectIngredient(S.sud(), "FOOBAR");
		});
	},
	"test should set relevant sud prop to selected ingredient name": function(){
		var sud = S.sud(),
		    tech = "hiddenSingle",
			ingredient = "cand";
		S.UI.selectTech(sud,tech);
		S.UI.selectIngredient(sud,ingredient);
		assertEquals(ingredient,sud.currentIngredient);
	}
});

TestCase("UI pickIngredient function",{
	"test should be defined": function(){
		assertFunction(S.UI.pickIngredient);
	},
	"test should do nothing if type doesn't match selected ingredient type": function(){
		var sud = S.sud();
		S.UI.selectTech(sud,"hiddenSingle");
		S.UI.selectIngredient(sud,"houseType");
		S.UI.pickIngredient(sud,"cand",5);
		assertEquals({},sud.pickedIngredients);
	},
	"test should do nothing if no tech is selected": function(){
        var sud = S.sud();
		S.UI.pickIngredient(sud,"cand",5);
		assertEquals({},sud.pickedIngredients);
	},
	"test should do nothing if no ingredient is selected": function(){
        var sud = S.sud();
		S.UI.selectTech(sud,"hiddenSingle");
		S.UI.pickIngredient(sud,"cand",5);
		assertEquals({},sud.pickedIngredients);
	}
});

TestCase("UI pickIngredient receiving candidate",{
	"test should pick singlecand correctly": function(){
		var sud = S.sud();
		S.UI.selectTech(sud,"hiddenSingle");
		S.UI.selectIngredient(sud,"cand");
		S.UI.pickIngredient(sud,"cand",5);
		assertEquals({cand:5},sud.pickedIngredients);
	},
	"test should add first cand to candcollection correctly": function(){
		var sud = S.sud();
		S.UI.selectTech(sud,"nakedSubset");
		S.UI.selectIngredient(sud,"cands");
		S.UI.pickIngredient(sud,"cand",5);
		assertEquals({cands:[5]},sud.pickedIngredients);
	},
	"test should add second cand to candcollection correctly": function(){
		var sud = S.sud();
		S.UI.selectTech(sud,"nakedSubset");
		S.UI.selectIngredient(sud,"cands");
		S.UI.pickIngredient(sud,"cand",5);
		S.UI.pickIngredient(sud,"cand",6);
		assertEquals({cands:[5,6]},sud.pickedIngredients);
	},
	"test should remove existing cand from candcollection correctly": function(){
		var sud = S.sud();
		S.UI.selectTech(sud,"nakedSubset");
		S.UI.selectIngredient(sud,"cands");
		S.UI.pickIngredient(sud,"cand",5);
		S.UI.pickIngredient(sud,"cand",6);
		S.UI.pickIngredient(sud,"cand",7);
		S.UI.pickIngredient(sud,"cand",6);
		assertEquals({cands:[5,7]},sud.pickedIngredients);
	}
});

TestCase("UI pickIngredient receiving square",{
	"test should pick single square corectly": function(){
		var sud = S.sud();
		S.UI.selectTech(sud,"hiddenSingle");
		S.UI.selectIngredient(sud,"square");
		S.UI.pickIngredient(sud,"square","r1c1b1");
		assertEquals({square:"r1c1b1"},sud.pickedIngredients);
	},
	"test should add first square to squarecollection correctly": function(){
		var sud = S.sud();
		S.UI.selectTech(sud,"lockedCandidates");
		S.UI.selectIngredient(sud,"squares");
		S.UI.pickIngredient(sud,"square","r1c1b1");
		assertEquals({squares:["r1c1b1"]},sud.pickedIngredients);
	},
	"test should add second square to candcollection correctly": function(){
		var sud = S.sud();
		S.UI.selectTech(sud,"lockedCandidates");
		S.UI.selectIngredient(sud,"squares");
		S.UI.pickIngredient(sud,"square","r1c1b1");
		S.UI.pickIngredient(sud,"square","r1c2b1");
		assertEquals({squares:["r1c1b1","r1c2b1"]},sud.pickedIngredients);
	},
	"test should remove existing square from squarecollection correctly": function(){
		var sud = S.sud();
		S.UI.selectTech(sud,"lockedCandidates");
		S.UI.selectIngredient(sud,"squares");
		S.UI.pickIngredient(sud,"square","r1c1b1");
		S.UI.pickIngredient(sud,"square","r1c2b1");
		S.UI.pickIngredient(sud,"square","r1c3b1");
		S.UI.pickIngredient(sud,"square","r1c2b1");
		assertEquals({squares:["r1c1b1","r1c3b1"]},sud.pickedIngredients);
	}
});

TestCase("UI pickIngredient receiving houseType",{
	"test should set singleHouseType correctly": function(){
		var sud = S.sud();
		S.UI.selectTech(sud,"hiddenSingle");
		S.UI.selectIngredient(sud,"houseType");
		S.UI.pickIngredient(sud,"houseType","r");
		assertEquals({houseType:"r"},sud.pickedIngredients);
	},
	"test should not pick box if ingredient can't be box": function(){
		var sud = S.sud();
		S.UI.selectTech(sud,"fish");
		S.UI.selectIngredient(sud,"orientation");
		S.UI.pickIngredient(sud,"houseType","b");
		assertEquals({},sud.pickedIngredients);
	},
	"test should pick other ingredient if anti is set": function(){
		var sud = S.sud();
		S.UI.selectTech(sud,"fish");
		S.UI.selectIngredient(sud,"antiorientation");
		S.UI.pickIngredient(sud,"houseType","r");
		assertEquals({orientation:"c"},sud.pickedIngredients);
	},
	"test should set other ingredient to box if oneboxwith is set and nonbox is selected": function(){
		var sud = S.sud();
		S.UI.selectTech(sud,"lockedCandidates");
		S.UI.selectIngredient(sud,"candsin");
		S.UI.pickIngredient(sud,"houseType","r");
		assertEquals({candsin:"r",deletefrom:"b"},sud.pickedIngredients);
	},
	"test should clear other ingredient from box if oneboxwith is set and box is selected": function(){
		var sud = S.sud();
		S.UI.selectTech(sud,"lockedCandidates");
		S.UI.selectIngredient(sud,"candsin");
		S.UI.pickIngredient(sud,"houseType","b");
		S.UI.selectIngredient(sud,"deletefrom");
		S.UI.pickIngredient(sud,"houseType","b");
		assertEquals({deletefrom:"b"},sud.pickedIngredients);
	}
});