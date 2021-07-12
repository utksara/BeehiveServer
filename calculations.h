
#include<iostream>
#include <vector>
#define Point array<float, 2>
#define Curve vector <Point>
#define PACKAGE __declspec(package)

using namespace std;

template<typename T> 
class Ringu{
    private:  
        vector <T> v;
    public:
        Ringu(vector <T> &x);
        T& operator[](int index);
};

template <typename T>
T& Ringu<T>::operator[](int index){
    int vec_size = v.size();
    if (index < 0){
        // cout << vec_size + index%vec_size -1 ;
        index = vec_size-1 + index%vec_size;
    }else{
        index = index%vec_size;
    }
    return v.at(index);
};

template <typename T>
Ringu<T>::Ringu(vector <T> &x){
    v = x;
};

class classone{
    private:  
        int i = 191;
    public:
        void show();
};