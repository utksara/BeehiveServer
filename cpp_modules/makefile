
PRIMEORDEAL_HOME = .

all : test1 test2

.PHONY : test1
test1:
	g++ -std=c++11 test1.cpp $(PRIMEORDEAL_HOME)/primeordeal/system.cpp -o test
	./test


.PHONY : test2
test2:
	g++ -std=c++17 test2.cpp $(PRIMEORDEAL_HOME)/primeordeal/system.cpp -o test
	./test