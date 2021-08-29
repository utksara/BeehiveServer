#include <map>
#include <vector>
#include <utility>
#include <stdexcept>
#include <bits/stl_algobase.h>
#include <bits/range_access.h>
#include <array>
#include<iostream>

#define INCLUDE_IOSTREAM 1

struct LINK {
  int x = 1; 
};

template<typename T> struct TYPE{
  typedef const char *string;
  typedef std::map<string, T> scalar_valued;
  typedef std::map<string, std::vector<T>> vector_valued;
};

template<typename inputtype, typename outputtype> struct SYSTEM {
  typedef TYPE<inputtype> _inputtype;
  typedef TYPE<outputtype> _outputtype;
  typename _inputtype::scalar_valued INPUT;
  typename _outputtype::vector_valued OUTPUT;
  SYSTEM *LINKED_SYSTEMS[100];
};
// void CREATE_NEW_SYSTEM();
// void CREATE_COPIES_OF_SYSTEM(SYSTEM S, int N);
// void CONNECT_SYSTEMS(SYSTEM PARENT, SYSTEM CHILDREN);
// void PARALLELISE_SYSTEMS(SYSTEM S1, SYSTEM S2);