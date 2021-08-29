#ifndef INCLUDE_IOSTREAM
	#include<iostream>
#endif
#include "primeordeal/primeordeal.h"
#include<math.h>

using namespace std;

int main(){
	
	SYSTEM<int, int> *cell1 = new SYSTEM<int, int>{
		.INPUT = {
			{"food", 1}
		},
		.OUTPUT = {
			{"signal", {2}}
		}
	};

	SYSTEM<int, int> *cell2 = new SYSTEM<int, int>{
		.INPUT = {
			{"food", 1}
		},
		.OUTPUT = {
			{"signal", {2}}
		}
	};

	SYSTEM<float, float> *cell_matrix = new SYSTEM<float, float> {
		.INPUT = {
			{"signal", 1},
			{"resources", 1}
		},
		.OUTPUT = {
			{"food", {2}}
		}
	};
	// std::vector<LINK*> CHILDREN_SYSTEMS {new SYSTEM<int, int>, new SYSTEM<int, int>};
}
