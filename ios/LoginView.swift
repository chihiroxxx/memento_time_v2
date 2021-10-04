//
//  LoginView.swift
//  memento_app
//
//  Created by 小林千紘 on 2021/09/27.
//

import SwiftUI

struct LoginView: View {

    @ObservedObject var userData = UserData()
    @State var inputUsername = ""
    @State var inputPassword = ""
    var body: some View {

        VStack(spacing: 10){
            TextField("User Name",text: $inputUsername, onCommit: {
            })
            .disableAutocorrection(true)
            .autocapitalization(.none)
            .padding()
            .border(Color.gray)
            SecureField("Password",text: $inputPassword, onCommit: {
            })
            .disableAutocorrection(true)
            .autocapitalization(.none)
            .padding()
            .border(Color.gray)
            Button(action: {

               userData.loginBackend(userName: inputUsername, password: inputPassword)

            }){
                Text("Login")
            }
            Text("新規登録はこちら！")
        }
    }
}

struct LoginView_Previews: PreviewProvider {
    static var previews: some View {
        LoginView()
    }
}


