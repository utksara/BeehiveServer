ARGS = "100,200 700,900"

.PHONY : clean
clean:
	rm ./*o

.PHONY : process
process:
	g++ -std=c++11 main.cpp dist/jsoncpp.cpp processes.cpp calculations.cpp -o main 
	./main

.PHONY : calculations
calculations:
	g++ calculations.cpp -o calculations
	./calculations

.PHONY : test
test:
	g++ test.cpp calculations.cpp -o test
	./test