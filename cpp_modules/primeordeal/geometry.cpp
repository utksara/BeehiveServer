#include <Eigen/Dense>
#include "geometry.h"

using namespace std;

// Operator overload to add two points
Point operator + (Point &p1, Point &p2){
    return {p1[0] + p2[0], p1[1] + p2[1]};
}

// Copies Curve c1 to Curve c2
void Copy_curve(Curve c1, Curve& c2){
    c2.clear();
    for (auto p : c1){
        c2.push_back(p);
    }
}

// Get coordinate in form of datatype::Point from a coordinate string
Point _get_point_coordinates(string word){
    stringstream read_word(word);
    Point p;
    int n, i = 0;
    while (read_word.good()) {
        string substr;
        getline(read_word, substr, ',');
        stringstream s(substr);
        s >> n;
        p[i] = n;
        i++; 
    }
    return p;
}

// Calculate distance between two points
float _distance(Point p1, Point p2){
    return sqrt((p1[0] - p2[0], 2) + pow(p1[1] - p2[1], 2));
}

// calculate normal vetor at a given point in a curve
Point normal_vector(Curve c, Point p, float mag){
    auto it = find (c.begin(), c.end(), p);
    int index = it - c.begin();
    if (it != c.end()){
        Ringu<Point> r(c);
        Point p2 = r[index+1], p1 = r[index-1];
        float dx = p2[0] - p1[0], dy = p2[1] - p1[1];
        float dr = sqrt(pow(dx, 2) + pow(dy, 2));
        float costheta = +dy/dr, sintheta = -dx/dr;
        int sign = 1;
        Point normal = { sign * mag * costheta, sign * mag * sintheta};
        return normal;
    }
    else {
        cout<< "\nalert! point not found in curve ";
        return p;
    }
}