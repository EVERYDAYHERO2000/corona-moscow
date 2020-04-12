export default class Shader {
    constructor (){

        return {
            fragment : `
            precision mediump float;
            varying vec4 v_color;
    
            void main() {
    
            float alpha = 0.8;    
            
            

            float border = 0.3;

            float radius = 0.5;
            if (v_color[0] == 1.0 && v_color[1] == 0.01 && v_color[2] == 0.0) {
            border = 0.4;
            radius = 0.7;
            }


            vec4 color0 = vec4(0.0, 0.0, 0.0, 0.0);
            vec4 color1 = vec4(v_color[0], v_color[1], v_color[2], alpha);
    
            vec2 m = gl_PointCoord.xy - vec2(0.5, 0.5);
            float dist = radius - sqrt(m.x * m.x + m.y * m.y);
    
            float t = 0.0;
            if (dist > border)
            t = 1.0;
            else if (dist > 0.0)
            t = dist / border;
    
            //float centerDist = length(gl_PointCoord - 0.5);
            // works for overlapping circles if blending is enabled
    
    
    
            gl_FragColor = mix(color0, color1, t);
    
            }
            `,
            vertex : `
            uniform mat4 u_matrix;
            attribute vec4 a_vertex;
            attribute float a_pointSize;
            attribute vec4 a_color;
            varying vec4 v_color;
    
            void main() {
            // Set the size of the point
            gl_PointSize =  a_pointSize;
    
            // multiply each vertex by a matrix.
            gl_Position = u_matrix * a_vertex;
    
    
            // pass the color to the fragment shader
            v_color = a_color;
            }
            `
        }

    }
}    