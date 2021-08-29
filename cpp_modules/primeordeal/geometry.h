
#include<iostream>
#include <vector>
#include <array>
#include <map>
#include <math.h>
#include<fstream>
#include<sstream>

using namespace std;

#define INCLUDE_PRIMEORDEAL_GEOMETRY 1

#define Point array<float, 2>
#define Curve vector <Point>
#define Vector_field map <Point, Stress>
#define Plane vector < vector <Point>>
#define Quantity array<float, 2>
#define Vector_function map <Vector_field, Vector_field>
#define PACKAGE __declspec(package)

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

Point operator + (Point &p1, Point &p2);
void Copy_curve(Curve c1, Curve& c2);
Point _get_point_coordinates(string word);
float _distance(Point p1, Point p2);
