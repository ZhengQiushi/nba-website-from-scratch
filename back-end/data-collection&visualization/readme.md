# �������ݿ�����ݻ�ȡ�����ӻ�ͼ����

## 1. �ļ�Ŀ¼һ��
- csv : ��������Դ�ļ�
- getdata.ipynb : ��ȡ����
- getData.py : opencv��ͼ����



## 2. ���ݿ����ݻ�ȡ
���getdata.ipynb����Ҫ�������£�

```python
# �ҵ�����ȡ��url
url = "https://china.nba.com/static/data/league/teamstats_All_All_2020_2.json"
# ��Ӧ��ȡ
response = requests.get(url, timeout=5) #headers=headers,
# �ļ�����
data = response.json()
teams = data['payload']['teams']
# ���һЩ�л���
# �����pd
all_team = pd.DataFrame(teams)
#����Ϊcvs����ӦĿ¼
```



## 3. ͼ����ӻ�

TODO : ��pychart����

1. **��Ա�����������ݿ��ӻ���**

   ��joel-embiidΪ����

   **����һ���������ݺ��������ݵĶԱ�ͼ��**��������״Ҳ������״ͼ

![image-20210426094624203](C:\Users\THINK\AppData\Roaming\Typora\typora-user-images\image-20210426094624203.png)

��https://china.nba.com/players/vs/#!/joel_embiid/?��

![image-20210426095733826](C:\Users\THINK\AppData\Roaming\Typora\typora-user-images\image-20210426095733826.png)

(https://blog.csdn.net/ninewolfyan/article/details/83786205?)

**���ݼ������̣�**

�ȵ�`players_basic`���ҵ�`��Աid`

![image-20210426095019132](C:\Users\THINK\AppData\Roaming\Typora\typora-user-images\image-20210426095019132.png)

Ȼ���ҵ�`player`/`all_player_statAverage.csv`

![image-20210426095050052](C:\Users\THINK\AppData\Roaming\Typora\typora-user-images\image-20210426095050052.png)

�������Ҫ�õ�������ͷ��

> assistsPg(��������)
>
> blocksPg(������ñ)
>
> pointsPg(�����÷�),
>
> rebsPg,(��������),
>
> stealsPg(��������),
>
> fgpct(����Ͷ��������%)��
>
> ftpct(��������������%)��
>
> tppct(��������������%)

2. **��Ա����Ͷ���ȵ�ͼ���ӻ�**

�ο�`getData.py`, ѡһ�������˰�~

![image-20210426100100400](C:\Users\THINK\AppData\Roaming\Typora\typora-user-images\image-20210426100100400.png)

![image-20210426100113068](C:\Users\THINK\AppData\Roaming\Typora\typora-user-images\image-20210426100113068.png)

![image-20210426100037952](C:\Users\THINK\AppData\Roaming\Typora\typora-user-images\image-20210426100037952.png)

![image-20210426100049418](C:\Users\THINK\AppData\Roaming\Typora\typora-user-images\image-20210426100049418.png)

https://www.nba.com/stats/events/?flag=3&CFID=33&CFPARAMS=2020-21&PlayerID=2544&ContextMeasure=FGA&Season=2020-21&section=player&sct=hex

