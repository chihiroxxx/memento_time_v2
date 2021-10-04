//
//  IndexCardData.swift
//  memento_app
//
//  Created by 小林千紘 on 2021/09/29.
//

import Foundation



struct IndexCardItemData: Identifiable, Codable {
    let id = UUID()
    let thoughtid: Int
    let thoughts: String
    let date: String
    let booktitle: String
    let author: String
    let bookimage: String
   let page: Int
   let readingtime: Int

}


class IndexCardData: ObservableObject {
    let auth = Auth.provider



    @Published var indexCardArr: [IndexCardItemData] = []

    struct JsonIndexData: Codable {
        let id: Int
        let thoughts: String
        let page: Int
        let readingtime: Int
        let date: String
        let createdat: String
        let updatedat: String
        let bookid: Int
        let booktitle: String
        let author: String
        let bookimage: String
        let userid: Int
    }

    func getIndexCard(){
        guard let url = URL(string: backendUrl+"/restricted/thoughts/"+auth.userid!) else {
            return
        }
        var req = URLRequest(url: url)
        if auth.token != nil {
            req.allHTTPHeaderFields = ["Authorization": "Bearer \(auth.token!)"]
        }
        let session = URLSession.shared
        session.dataTask(with: req) { (data, response, error) in
            if error == nil, let data = data, let response = response as? HTTPURLResponse {
                if response.statusCode == 200 {
                    print("サーバOK！！")
                    do {
                        let decoder = JSONDecoder()
                        let json = try decoder.decode([JsonIndexData].self, from: data)

                        for i in 0..<json.count {
                            let thought = IndexCardItemData(thoughtid: json[i].id, thoughts: json[i].thoughts, date: json[i].date, booktitle: json[i].booktitle, author: json[i].author, bookimage: json[i].bookimage, page: json[i].page, readingtime: json[i].readingtime)
                            self.indexCardArr.append(thought)

                        }

                        print(self.indexCardArr)
                    } catch {
                        print("jsonパースエラー！！")
                    }

                } else {
                    print("サーバエラー...")
                }
            }
        }.resume()








    }




}
