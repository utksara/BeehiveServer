#include <map>
#include <vector>
#include <array>

using namespace std;

#define Point2D array<float, 2>
#define Point3D array<float, 3>
#define Curve vector <Point2D>
#define Vector_field map <Point3D, Stress>
#define Plane vector < vector <Point2D>>
#define Vector_function map <Vector_field, Vector_field>