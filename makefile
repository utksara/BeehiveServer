INCLUDE_JSON = -I ./cpp_modules/dist/ ./cpp_modules/dist/*.cpp
INCLUDE_PRIMEORDEAL = -I ./cpp_modules/primeordeal/  ./cpp_modules/primeordeal/*.cpp
INCLUDE_UTILS = -I ./cpp_modules/  ./cpp_modules/*.cpp

.PHONY : clean
clean:
	rm ./*o
	
main:
	g++ -std=c++11 main.cpp $(INCLUDE_JSON) $(INCLUDE_PRIMEORDEAL) $(INCLUDE_UTILS) processes.cpp -o cpp_bins/main

.PHONY : calculations
calculations:
	g++ calculations.cpp -o calculations
	./cpp_bins/calculations

.PHONY : test
test:
	g++ test.cpp calculations.cpp -o test
	./cpp_bins/test

.PHONY : beehive_tests
beehive_tests:
	node module_tests.js

.PHONY : basicbuild
basicbuild:
	g++ -std=c++17 basicmath.cpp -o basic 

.PHONY : basictest
basictest:basicbuild
	./cpp_bins/basic square 2
	./cpp_bins/basic log10 100000
	./cpp_bins/basic cube 3

.PHONY : maintests
maintests: main
	# ./cpp_bins/main float "1011.1"
	./cpp_bins/main line center "500,500" angle "0.52" length "400" 

.PHONY : maintestsonly
maintestsonly:
	./cpp_bins/main line center "500,500" angle "0.52" length "400" 