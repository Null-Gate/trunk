import 'package:car_gate_flutter/constant/colors.dart';
import 'package:flutter/material.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen
({super.key});

  @override
  Widget build(BuildContext context) {
    return const  Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
          children: [
            CustomCirclePaintView(),
            Padding(
              padding: EdgeInsets.only(left: 45,right:45,top: 250),
              child: LoginAndRegisterView(),
            )
          ],
        ),
      
    );
  }
}

class LoginAndRegisterView extends StatefulWidget {
  const LoginAndRegisterView
  ({super.key}); 

  @override
  State<LoginAndRegisterView> createState() => _LoginAndRegisterViewState();
}

class _LoginAndRegisterViewState extends State<LoginAndRegisterView> {
  
  bool _isLoginPage =true;
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          children: [
            GestureDetector(
              onTap: (){
                setState(() {
                  _isLoginPage=true;
                  
                });
              },
              child: Container(
                padding: EdgeInsets.symmetric(horizontal: 15,vertical: 5),
                decoration: BoxDecoration(
                  border: Border(bottom: BorderSide(
                    color: _isLoginPage?kPrimaryColor:Colors.grey,
                    width: 2
                  ))
                ),
                child: Text("Login",style: TextStyle(color: _isLoginPage?kPrimaryColor:Colors.grey,
                fontSize: 18,
                fontWeight: FontWeight.w600),),
              ),
            ),
            const Padding(padding: EdgeInsets.all(2)),
            GestureDetector(
              onTap: () {
                setState(() {
                  _isLoginPage=false;
                });
              },
              child: Container(
                padding: EdgeInsets.symmetric(horizontal: 15,vertical: 5),
                decoration: BoxDecoration(
                  border: Border(bottom: BorderSide(
                    color: _isLoginPage? Colors.grey:kPrimaryColor,
                    width: 2
                  ))
                ),
                child: Text("Register",style: TextStyle(color:_isLoginPage? Colors.grey:kPrimaryColor,
                fontSize: 18,
                fontWeight: FontWeight.w600),),
              ),
            )
          ]
            
        
        ),
        Stack(
          children: [
            (_isLoginPage==true)?
            const LoginView():const SignUpView()
          ],
        )
      ],
    );
  }
}
class LoginView extends StatelessWidget {
  const LoginView({super.key});

  @override
  Widget build(BuildContext context) {
    return  SizedBox(
      height: MediaQuery.of(context).size.height*0.4,
      child: const Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            TextFieldReuseableWidget(
              textFieldName: "User Name",
               hintText: "Maung Thar Kyaw", 
               icon: Icons.person_outline),
            TextFieldReuseableWidget(
              textFieldName: "Password", 
              hintText: "password", icon: Icons.lock),
            LoginAndRegisterButton(buttonName: "Login")
          ],
      
      ),
    );
  }
}

class SignUpView extends StatelessWidget {
  const SignUpView({super.key});

  @override
  Widget build(BuildContext context) {
    return  SizedBox(
      height: MediaQuery.of(context).size.height*0.5,
      child: const Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          TextFieldReuseableWidget(
            textFieldName: "User Name", 
            hintText: "Maung Thar Kyaw",
             icon: Icons.person_outline),
          TextFieldReuseableWidget(textFieldName: "Email", 
          hintText: "Email@gmail.com", 
          icon: Icons.email_outlined
          ),
          TextFieldReuseableWidget(
            textFieldName: "Password",
             hintText: "password",
              icon: Icons.lock_outline_rounded),
          
          LoginAndRegisterButton(buttonName: "Register")
        ],
      ),
    );
  }
}

class TextFieldReuseableWidget extends StatelessWidget {
  const TextFieldReuseableWidget({super.key, required this.textFieldName, required this.hintText, required this.icon});

  final String textFieldName;
  final String hintText;
  final IconData icon;


  @override
  Widget build(BuildContext context) {
    return Container(
      width: MediaQuery.of(context).size.width,
      height: 70,
      alignment: Alignment.center,
      padding: const EdgeInsets.symmetric(horizontal: 20,vertical: 5),
      decoration: BoxDecoration(
        boxShadow: [
           BoxShadow(
        color: Colors.grey.withOpacity(0.5),
        spreadRadius: 5,
        blurRadius: 7,
        offset: Offset(0, 3)
      ),
        ],
        color: Colors.white,
        borderRadius: BorderRadius.circular(6)
      ),
      child:   Column(
        
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
               Padding(
                padding:const  EdgeInsets.only(right: 10),
                child: Icon(icon,size: 25,),
              ),
              Text(textFieldName,style: const TextStyle(
                fontWeight: FontWeight.w500,
                fontSize: 16
              ),)
            ],
          ),
          SizedBox(
            height: 30,
            child: TextField(
              decoration: InputDecoration(
                border: InputBorder.none,
                hintText: hintText,
                hintStyle: const TextStyle(
                  fontWeight: FontWeight.w300,
                  fontSize: 15
                )
              ),
            ),
          )
        ],
      ),
    );
  }
}



class LoginAndRegisterButton extends StatelessWidget {
  const LoginAndRegisterButton({super.key, required this.buttonName});

  final String buttonName;
  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      style: const ButtonStyle(
        padding: WidgetStatePropertyAll(EdgeInsets.symmetric(horizontal: 100)),
        backgroundColor: WidgetStatePropertyAll(kPrimaryColor)
      ),
      onPressed: (){

      }, 
      child: Text(buttonName,style: TextStyle(
        color: Colors.white,
        fontWeight: FontWeight.w600,
        fontSize: 14
      ),)
    );
  }
}
class CustomCirclePaintView extends StatelessWidget {
  const CustomCirclePaintView({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: CustomPaint(
        size: Size.infinite,
        painter: CirclePainter(circles: [
          CircleData(
            center: Offset(20, -30), 
            radius: 100, 
            shadowOffset: Offset(10, 10), color: kPrimaryColor),
          CircleData(
            center: Offset(300, -30), 
            radius: 145, 
            shadowOffset: Offset(10, 10), color: kPrimaryColor),
          CircleData(
            center: Offset(40, MediaQuery.of(context).size.height*0.89), 
            radius: 50, 
            shadowOffset: Offset(10, 10), color: kPrimaryColor),
          CircleData(
            center: Offset(100, MediaQuery.of(context).size.height*0.8), 
            radius: 20, 
            shadowOffset: Offset(10, 10), color: kPrimaryColor),
          
        ]),
      ),
    );
  }
}

class CircleData {
  final Offset center;
  final double radius;
  final Offset shadowOffset;
  final Color color;

  CircleData({
    required this.center,
    required this.radius,
    required this.shadowOffset,
    required this.color,
  });
}

class CirclePainter extends CustomPainter {
  final List<CircleData> circles;

  CirclePainter({required this.circles});

  @override
  void paint(Canvas canvas, Size size) {
    for (var circle in circles) {
      Paint shadowPaint = Paint()
        ..color = Colors.black.withOpacity(0.3)
        ..style = PaintingStyle.fill
        ..maskFilter = MaskFilter.blur(BlurStyle.normal, 10);
      Paint circlePaint = Paint()
        ..color = circle.color
        ..style = PaintingStyle.fill;
      canvas.drawCircle(circle.center + circle.shadowOffset, circle.radius, shadowPaint);
      canvas.drawCircle(circle.center, circle.radius, circlePaint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return false;
  }
}