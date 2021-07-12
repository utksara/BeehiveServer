#include "math.h"
#include <Eigen/Dense>
#include "processes.h"

using namespace std;

Curve contours;


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

float _distance(Point p1, Point p2){
    return sqrt((p1[0] - p2[0], 2) + pow(p1[1] - p2[1], 2));
}


Point _normal_vector(Curve c, Point p, float mag){
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
        cout<< "\nalert! :point not in curve ";
        return p;
    }
}

void draw_contour(json process_request){
    int base_radius = 50;
    string values = process_request["values"].asString(); 
    stringstream ss(values);
    string word;
    while(ss >> word){
        Point p = _get_point_coordinates(word);
        int N = 50;
        string coords;   
        for (int F = 3; F <= 10; F ++){
            coords.append("M");
            for (int k = 0 ; k < F * N; k ++ ){
                float theta = k * 2*3.14/(F * N);
                float x = F * base_radius * cos(theta) + p[0];
                float y = F * base_radius * sin(theta) + p[1];
                coords.append(to_string(x));
                coords.append(",");
                coords.append(to_string(y));
                coords.append(" ");        
            }
            coords.append("Z");
        } 

        string output_data = "{\"data\" : \"";
        output_data.append(coords);
        output_data.append("\"}");
        ofstream output_file("output_data.json", std::ifstream::binary);
        output_file << output_data;
        output_file.close();
    }
}

void update_displacement_field(json process_request){
    int no_of_contours = 40;
    string values = process_request["values"]["displacement"].asString(); 
    stringstream ss;
    ss << values;
    Curve boundary_displacement_field;
    string word;
    while(ss >> word){
        Point p = _get_point_coordinates(word);
        boundary_displacement_field.push_back(p);
    }

    ss.clear();
    values.clear();

    values = process_request["values"]["boundary"].asString(); 
    ss << values;
    Curve boundary;
    while(ss >> word){
        Point p = _get_point_coordinates(word);
        boundary.push_back(p);
    }
    using namespace Eigen;

    // int N = 50;
    // MatrixXf Op = MatrixXf::Identity(N,N);
    // Matrix <float, Dynamic, 1> x = MatrixXf::Identity(N,1);
    // Matrix <float, Dynamic, 1> v = MatrixXf::Ones(N,1);

    // for (int i = 1; i < N; i ++){
    //     for (int j = 0; j < i; j ++){
    //         Op(i,j) = -1/pow(2,i-j); 
    //     }
    // }
    // x = Op.inverse() * v;

    Curve new_boundary = boundary, current_boundary; 
    Point new_p;
    string coords;
    
    for (int i_contour = 1; i_contour < no_of_contours; i_contour++){
        coords.append("M ");
        Copy_curve(new_boundary, current_boundary);
        new_boundary.clear();
        for (auto p : current_boundary){
            Point normal = _normal_vector(current_boundary, p, 10.0);
            new_p = p + normal;
            new_boundary.push_back(new_p);
            coords.append(to_string(new_p[0]));
            coords.append(",");
            coords.append(to_string(new_p[1]));
            coords.append(" ");        
        }
        coords.append("Z ");
    }

    string output_data = "{\"data\" : \"";
    output_data.append(coords);
    output_data.append("\"}");
    ofstream output_file("output_data.json", std::ifstream::binary);
    output_file << output_data;
    output_file.close();
    
}
